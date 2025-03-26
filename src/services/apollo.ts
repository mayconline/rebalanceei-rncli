import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  resetCaches,
  gql,
  fromPromise,
  Observable,
  type FetchResult,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getLocalStorage, multiSetLocalStorage } from '../utils/localStorage';

import Config from '../config/envs';

// Links para os servidores
const primaryHttpLink = createHttpLink({
  uri: Config?.backApiUrl,
  credentials: 'include',
});

// Link para gerenciar o retry
const retryLink = new ApolloLink((operation, forward) => {
  return new Observable<FetchResult>(observer => {
    const subscription = forward(operation).subscribe({
      next(response) {
        if (response?.errors) {
          // Se houver erro, tenta o segundo link
          const secondaryObservable = primaryHttpLink.request(operation);
          if (secondaryObservable) {
            secondaryObservable.subscribe({
              next(secondaryResponse) {
                observer.next(secondaryResponse);
                observer.complete();
              },
              error(err) {
                observer.error(err);
              },
            });
          } else {
            observer.error(new Error('Secondary link returned null.'));
          }
        } else {
          observer.next(response);
          observer.complete();
        }
      },
      error(err) {
        observer.error(err);
      },
    });

    // Retornar a função de limpeza da assinatura
    return () => {
      subscription.unsubscribe();
    };
  });
});

// Link de tratamento de erro de autenticação
const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (operation.operationName === 'updateRefreshToken') return;

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.message) {
        case 'Context creation failed: Token Invalid or Expired':
          return fromPromise(getNewToken())
            .filter(value => Boolean(value))
            .flatMap(accessToken => {
              const oldHeaders = operation.getContext().headers;
              // Modificar o contexto da operação com um novo token
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${accessToken}`,
                },
              });

              // Retry a requisição, retornando o novo observable
              return forward(operation);
            });
      }
    }
  }
});

// Link de autenticação
const authLink = setContext(async ({ operationName }, { headers }) => {
  const storageToken = await getLocalStorage('@authToken');

  const skipRefresh = operationName !== 'updateRefreshToken';

  return {
    headers: {
      ...headers,
      ...(skipRefresh && {
        authorization: storageToken ? `Bearer ${storageToken}` : '',
      }),
    },
  };
});

// Configuração do Apollo Client
export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, authErrorLink, authLink, primaryHttpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getTicketsByWallet: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getWalletByUser: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getRentability: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          rebalances: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          updateRefreshToken: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getUserByToken: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

// Função para obter um novo token
const getNewToken = async () => {
  try {
    const refreshToken = await getLocalStorage('@refreshToken');
    const response = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: {
        refreshToken: refreshToken || '',
      },
    });

    const { token, refreshToken: newRefreshToken } = response?.data
      ?.updateRefreshToken || { token: null, refreshToken: null };

    if (token && newRefreshToken) {
      await multiSetLocalStorage([
        ['@authToken', token],
        ['@refreshToken', newRefreshToken],
      ]);
    }

    return token;
  } catch (error) {
    resetCaches();
    throw error;
  }
};

// Mutação para atualizar o token
const REFRESH_TOKEN = gql`
  mutation updateRefreshToken($refreshToken: String!) {
    updateRefreshToken(input: { refreshToken: $refreshToken }) {
      token
      refreshToken
    }
  }
`;
