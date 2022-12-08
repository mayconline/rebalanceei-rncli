import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  resetCaches,
  gql,
  fromPromise,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getLocalStorage, multiSetLocalStorage } from '../utils/localStorage';

const httpLink = createHttpLink({
  uri: 'https://app-rebalanceei.onrender.com',
  credentials: 'include',
});

const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (operation.operationName === 'updateRefreshToken') return;

  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.message) {
        case 'Context creation failed: Token Invalid or Expired':
          return fromPromise(getNewToken())
            .filter(value => Boolean(value))
            .flatMap(accessToken => {
              const oldHeaders = operation.getContext().headers;
              // modify the operation context with a new token
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${accessToken}`,
                },
              });

              // retry the request, returning the new observable
              return forward(operation);
            });
      }
    }
  }
});

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

export const client = new ApolloClient({
  link: ApolloLink.from([authErrorLink, authLink, httpLink]),
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
        },
      },
    },
  }),
});

const getNewToken = () => {
  return getLocalStorage('@refreshToken')
    .then(refreshToken => {
      return client
        .mutate({
          mutation: REFRESH_TOKEN,
          variables: {
            refreshToken: refreshToken ? refreshToken : '',
          },
        })
        .then(async response => {
          const { token, refreshToken } = response.data.updateRefreshToken;

          await multiSetLocalStorage([
            ['@authToken', token],
            ['@refreshToken', refreshToken],
          ]);

          return token;
        })
        .catch(error => {
          resetCaches();

          throw error;
        });
    })
    .catch(async err => {
      resetCaches();

      throw err;
    });
};

const REFRESH_TOKEN = gql`
  mutation updateRefreshToken($refreshToken: String!) {
    updateRefreshToken(input: { refreshToken: $refreshToken }) {
      token
      refreshToken
    }
  }
`;
