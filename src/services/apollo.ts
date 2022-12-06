import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  resetCaches,
  gql,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import {
  getLocalStorage,
  multiRemoveLocalStorage,
  multiSetLocalStorage,
} from '../utils/localStorage';

const httpLink = createHttpLink({
  // uri: 'https://app-rebalanceei.onrender.com',
  uri: 'http://192.168.1.5:4000',
  credentials: 'include',
});

const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(async ({ message, extensions }) => {
      const errorMessages = [
        'Token Not Exists',
        'Context creation failed: Token Invalid or Expired',
      ];

      if (errorMessages.includes(message)) {
        const refreshToken = await getLocalStorage('@refreshToken');

        if (refreshToken) {
          updateRefreshToken(refreshToken)
            .then(async res => {
              if (res.data) {
                const { token, refreshToken } = res?.data?.updateRefreshToken;

                const oldHeaders = operation.getContext().headers;

                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${token}`,
                  },
                });

                await multiSetLocalStorage([
                  ['@authToken', token],
                  ['@refreshToken', refreshToken],
                ]);
              }
            })
            .catch(async err => {
              await multiRemoveLocalStorage(['@authToken', '@refreshToken']);
              resetCaches();
            });
        } else {
          await multiRemoveLocalStorage(['@authToken', '@refreshToken']);
          resetCaches();
        }

        return forward(operation);
      }
    });
  }
});

const authLink = setContext(async (_, { headers }) => {
  const storageToken = await getLocalStorage('@authToken');

  return {
    headers: {
      ...headers,
      authorization: storageToken ? `Bearer ${storageToken}` : '',
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

function updateRefreshToken(refreshToken: string) {
  return client.mutate({
    mutation: REFRESH_TOKEN,
    variables: {
      refreshToken,
    },
  });
}

const REFRESH_TOKEN = gql`
  mutation updateRefreshToken($refreshToken: ID!) {
    updateRefreshToken(input: { refreshToken: $refreshToken }) {
      token
      refreshToken
    }
  }
`;
