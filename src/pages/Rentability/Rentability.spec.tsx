import React from 'react';
import Rentability, { GET_RENTABILITY, GET_WALLET_BY_ID } from './index';

import { render } from '../../utils/testProvider';
import { GraphQLError } from 'graphql';

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    wallet: '5fa1d752a8c5892a48c69b35',
    handleSetLoading: jest.fn(),
  }),
}));

describe('Rentability Tab', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully list rentability', async () => {
    const {
      getAllByLabelText,
      findByLabelText,
      findAllByLabelText,
      getAllByRole,
    } = render(<Rentability />, [
      SUCCESSFUL_GET_WALLET_BY_ID,
      SUCCESSFUL_LIST_RENTABILITY,
    ]);

    const headers = getAllByRole('header');
    expect(headers[0]).toHaveTextContent(/Carteira/i);
    expect(headers[1]).toHaveTextContent(/Proventos/i);

    const symbolItemOne = (
      await findAllByLabelText(/Código do Ativo - Nome do Ativo/i)
    )[0];
    expect(symbolItemOne).toHaveProperty('children', [
      'MGLU3',
      ' - ',
      'Magazine Luiza S',
    ]);

    const costItemOne = getAllByLabelText(/Saldo aplicado no ativo/i)[0];
    expect(costItemOne).toHaveProperty('children', ['R$ 1.371,20']);

    const variationPercentItemOne = getAllByLabelText(
      /Porcentagem de variação do ativo/i,
    )[0];
    expect(variationPercentItemOne).toHaveProperty('children', [' (+36.8%)']);

    const currentAmountItemOne = getAllByLabelText(/Saldo atual do ativo/i)[0];
    expect(currentAmountItemOne).toHaveProperty('children', ['R$ 1.876,00']);

    const walletCost = (await findAllByLabelText('Saldo aplicado'))[0];
    expect(walletCost).toHaveProperty('children', ['R$ 16.900,63']);

    const walletCurrentAmount = (await findAllByLabelText('Saldo atual'))[0];
    expect((await walletCurrentAmount).props.children).toBe('R$ 18.816,10');

    const walletVariation = await findByLabelText(
      /Percentual de variação da carteira/i,
    );
    expect((await walletVariation).props.children).toBe(' (+11.3%)');

    const symbolItemTwo = getAllByLabelText(/Código do Ativo/i)[1];
    expect(symbolItemTwo).toHaveProperty('children', [
      'PSSA3',
      ' - ',
      'Porto Seguro S',
    ]);

    const costItemTwo = getAllByLabelText(/Saldo aplicado no ativo/i)[1];
    expect(costItemTwo).toHaveProperty('children', ['R$ 1.158,30']);

    const variationPercentItemTwo = getAllByLabelText(
      /Porcentagem de variação do ativo/i,
    )[1];
    expect(variationPercentItemTwo).toHaveProperty('children', [' (-11.9%)']);

    const currentAmountItemTwo = getAllByLabelText(/Saldo atual do ativo/i)[1];
    expect(currentAmountItemTwo).toHaveProperty('children', ['R$ 1.019,92']);
  });

  it('should throw error', async () => {
    const { findByText } = render(<Rentability />, [
      INVALID_LIST_RENTABILITY,
      INVALID_LIST_WALLET_BY_ID,
    ]);

    await findByText(/nenhum item encontrado/i);
  });
});

const SUCCESSFUL_GET_WALLET_BY_ID = {
  request: {
    query: GET_WALLET_BY_ID,
    variables: { _id: '5fa1d752a8c5892a48c69b35' },
  },
  result: {
    data: {
      getWalletById: {
        __typename: 'Wallet',
        _id: '5fa1d752a8c5892a48c69b35',
        percentRentabilityWallet: 11.34117485561191,
        sumAmountWallet: 18816.1,
        sumCostWallet: 16900.629999999997,
      },
    },
  },
};

const SUCCESSFUL_LIST_RENTABILITY = {
  request: {
    query: GET_RENTABILITY,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', sort: 'currentAmount' },
  },
  result: {
    data: {
      getRentability: [
        {
          __typename: 'Rentability',
          _id: '5fa47a89f704ca0f84523c05',
          costAmount: 1371.2,
          currentAmount: 1876,
          longName: 'Magazine Luiza S.A.',
          sumAmountWallet: 18824.290000000008,
          sumCostWallet: 16900.629999999997,
          symbol: 'MGLU3.SA',
          variationAmount: 504.79999999999995,
          variationPercent: 36.81446907817969,
        },
        {
          __typename: 'Rentability',
          _id: '5fa479f7f704ca0f84523c01',
          costAmount: 1158.3,
          currentAmount: 1019.92,
          longName: 'Porto Seguro S.A.',
          sumAmountWallet: 18824.290000000008,
          sumCostWallet: 16900.629999999997,
          symbol: 'PSSA3.SA',
          variationAmount: -138.38,
          variationPercent: -11.94681861348528,
        },
      ],
    },
  },
};

const INVALID_LIST_RENTABILITY = {
  request: {
    query: GET_RENTABILITY,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', sort: 'currentAmount' },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Sem conexão com o banco de dados.')],
  },
};

const INVALID_LIST_WALLET_BY_ID = {
  request: {
    query: GET_WALLET_BY_ID,
    variables: { _id: '5fa1d752a8c5892a48c69b35' },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Sem conexão com o banco de dados.')],
  },
};
