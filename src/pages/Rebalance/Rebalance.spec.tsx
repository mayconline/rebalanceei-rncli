import React from 'react';
import Rebalance, { REBALANCES } from './index';
import { render, waitFor } from '../../utils/testProvider';
import { GraphQLError } from 'graphql';

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    wallet: '5fa1d752a8c5892a48c69b35',
    handleSetLoading: jest.fn(),
  }),
}));

describe('Rebalance Tab', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully list rebalances', async () => {
    const { getByRole, getAllByLabelText, findAllByLabelText } = render(
      <Rebalance />,
      [SUCCESSFUL_LIST_REBALANCES],
    );

    const header = getByRole('header');
    expect(header).toHaveTextContent(/Rebalancear Ativos/i);

    const symbolItemOne = await findAllByLabelText(/Código do Ativo/i);

    expect(symbolItemOne[0]).toHaveTextContent(
      'IRBR3 - IRB-Brasil Resseguros S',
    );

    const currentPercentItemOne = getAllByLabelText(
      /Porcentagem atual do ativo/i,
    )[0];
    expect(currentPercentItemOne).toHaveProperty('children', [
      '% Atual: 1.6 %',
    ]);

    const targetPercentItemOne = getAllByLabelText(
      /Porcentagem ideal do ativo/i,
    )[0];
    expect(targetPercentItemOne).toHaveProperty('children', ['% Ideal: 3.0 %']);

    const statusItemOne = getAllByLabelText(/Status do ativo/i)[0];
    expect(statusItemOne).toHaveProperty('children', ['Comprar']);

    const targetAmountItemOne = getAllByLabelText(
      /Valor para rebalancear o ativo na carteira/i,
    )[0];
    expect(targetAmountItemOne).toHaveProperty('children', ['R$ 456,66']);

    const symbolItemThree = getAllByLabelText(/Código do Ativo/i)[2];
    expect(symbolItemThree).toHaveProperty('children', [
      'FLRY3',
      ' - ',
      'Fleury S',
    ]);

    const currentPercentItemThree = getAllByLabelText(
      /Porcentagem atual do ativo/i,
    )[2];
    expect(currentPercentItemThree).toHaveProperty('children', [
      '% Atual: 5.0 %',
    ]);

    const targetPercentItemThree = getAllByLabelText(
      /Porcentagem ideal do ativo/i,
    )[2];
    expect(targetPercentItemThree).toHaveProperty('children', [
      '% Ideal: 5.0 %',
    ]);

    const statusItemThree = getAllByLabelText(/Status do ativo/i)[2];
    expect(statusItemThree).toHaveProperty('children', ['Aguardar']);

    const targetAmountItemThree = getAllByLabelText(
      /Valor para rebalancear o ativo na carteira/i,
    )[2];
    expect(targetAmountItemThree).toHaveProperty('children', ['R$ 0,00']);

    const symbolItemFour = getAllByLabelText(/Código do Ativo/i)[3];
    expect(symbolItemFour).toHaveProperty('children', [
      'EGIE3',
      ' - ',
      'Engie Brasil Energia S',
    ]);

    const currentPercentItemFour = getAllByLabelText(
      /Porcentagem atual do ativo/i,
    )[3];
    expect(currentPercentItemFour).toHaveProperty('children', [
      '% Atual: 6.6 %',
    ]);

    const targetPercentItemFour = getAllByLabelText(
      /Porcentagem ideal do ativo/i,
    )[3];
    expect(targetPercentItemFour).toHaveProperty('children', [
      '% Ideal: 6.0 %',
    ]);

    const statusItemFour = getAllByLabelText(/Status do ativo/i)[3];
    expect(statusItemFour).toHaveProperty('children', ['Analizar']);

    const targetAmountItemFour = getAllByLabelText(
      /Valor para rebalancear o ativo na carteira/i,
    )[3];
    expect(targetAmountItemFour).toHaveProperty('children', ['R$ -112,83']);
  });

  it('should throw error', async () => {
    const { findByText } = render(<Rebalance />, [INVALID_LIST_REBALANCES]);

    await findByText(/nenhum item encontrado/i);
  });
});

const SUCCESSFUL_LIST_REBALANCES = {
  request: {
    query: REBALANCES,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', sort: 'targetAmount' },
  },
  result: {
    data: {
      rebalances: [
        {
          __typename: 'Rebalance',
          _id: '5fa47c1ff704ca0f84523c0f',
          currentAmount: 297.13,
          currentPercent: 1.5767180830402379,
          gradePercent: 3,
          longName: 'IRB-Brasil Resseguros S.A.',
          status: 'BUY',
          symbol: 'IRBR3.SA',
          targetAmount: 456.66360000000014,
          targetPercent: 1.423281916959762,
        },
        {
          __typename: 'Rebalance',
          _id: '5fa47c5cf704ca0f84523c11',
          currentAmount: 479.17999999999995,
          currentPercent: 3.542765022149298,
          gradePercent: 4,
          longName: 'Trisul S.A.',
          status: 'BUY',
          symbol: 'TRIS3.SA',
          targetAmount: 274.61360000000025,
          targetPercent: 0.4572349778507019,
        },
        {
          __typename: 'Rebalance',
          _id: '5fa47ad3f704ca0f84523c07',
          currentAmount: 1089.2,
          currentPercent: 5,
          gradePercent: 5,
          longName: 'Fleury S.A.',
          status: 'KEEP',
          symbol: 'FLRY3.SA',
          targetAmount: 0,
          targetPercent: 0,
        },
        {
          __typename: 'Rebalance',
          _id: '5fa47a4bf704ca0f84523c03',
          currentAmount: 1243.52,
          currentPercent: 6.598729413462783,
          gradePercent: 6,
          longName: 'Engie Brasil Energia S.A.',
          status: 'ANALYZE',
          symbol: 'EGIE3.SA',
          targetAmount: -112.82959999999989,
          targetPercent: -0.5987294134627827,
        },
      ],
    },
  },
};

const INVALID_LIST_REBALANCES = {
  request: {
    query: REBALANCES,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', sort: 'targetAmount' },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Sem conexão com o banco de dados.')],
  },
};
