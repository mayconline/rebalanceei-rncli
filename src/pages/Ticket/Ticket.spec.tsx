import React from 'react';
import Ticket, { GET_TICKETS_BY_WALLET } from './index';
import { render, fireEvent, act } from '../../utils/testProvider';
import { GraphQLError } from 'graphql';

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    wallet: '5fa1d752a8c5892a48c69b35',
    handleVerificationInvalidWallet: jest.fn(),
    handleSetLoading: jest.fn(),
  }),
}));

jest.mock('../../components/AdBanner', () => () => null);

describe('Ticket Tab', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully list tickets', async () => {
    const {
      findByRole,
      findAllByLabelText,
      getAllByRole,
      getAllByLabelText,
      findByText,
      mockOpenModal,
    } = render(<Ticket />, [SUCCESSFUL_LIST_TICKETS]);

    await findByRole('header');
    await findByText('Meus Ativos');

    const symbolItemOne = (
      await findAllByLabelText(/Código do Ativo - Nome do Ativo/i)
    )[0];

    expect(symbolItemOne).toHaveProperty('children', [
      'SAPR4',
      ' - ',
      'Companhia de Saneamento do Paraná - SANEPAR',
    ]);

    const quantityItemOne = getAllByLabelText(
      /Quantidade e Preço Médio do Ativo/i,
    )[0];

    expect(quantityItemOne).toHaveProperty('children', ['174x R$ 5,42']);

    const gradeItemOne = getAllByLabelText(
      /Nota para o peso do ativo esperado pela carteira/i,
    )[0];
    expect(gradeItemOne).toHaveProperty('children', ['6']);

    const listItems = getAllByRole('button');
    expect(listItems).toHaveLength(5);

    const editButton = getAllByLabelText('Editar')[0];

    await act(async () => {
      fireEvent.press(editButton);
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith('AddTicket', {
      ticket: {
        _id: '5fa479c9f704ca0f84523c00',
        averagePrice: 5.42,
        grade: 6,
        name: 'Companhia de Saneamento do Paraná - SANEPAR',
        quantity: 174,
        symbol: 'SAPR4.SA',
        classSymbol: 'Ação',
      },
    });
  });

  it('should render empty component', async () => {
    const { getByText, findByText, getByRole, mockOpenModal } = render(
      <Ticket />,
      [EMPTY_LIST_TICKETS],
    );

    const title = await findByText('Meus Ativos');
    expect(title).toBeTruthy();

    const emptyMessage = await findByText(
      'Adicione um ativo dando uma nota para ele.',
    );
    expect(emptyMessage).toBeTruthy();

    const subTitleText = getByText(
      'Usaremos essa nota para calcular a % ideal desse ativo nessa carteira.',
    );
    expect(subTitleText).toBeTruthy();

    const addButton = getByRole('button');
    expect(addButton).toHaveProperty('children', ['Adicionar Ativo']);

    await act(async () => {
      fireEvent.press(addButton);
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith('AddTicket');
  });

  it('should throw error', async () => {
    const { findByText } = render(<Ticket />, [INVALID_LIST_TICKETS]);

    findByText(/nenhum item encontrado/i);
  });
});

const SUCCESSFUL_LIST_TICKETS = {
  request: {
    query: GET_TICKETS_BY_WALLET,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', sort: 'grade' },
  },
  result: {
    data: {
      getTicketsByWallet: [
        {
          _id: '5fa479c9f704ca0f84523c00',
          averagePrice: 5.42,
          grade: 6,
          name: 'Companhia de Saneamento do Paraná - SANEPAR',
          quantity: 174,
          symbol: 'SAPR4.SA',
          classSymbol: 'Ação',
        },
        {
          _id: '5fa479f7f704ca0f84523c01',
          averagePrice: 54.76,
          grade: 6,
          name: 'Porto Seguro S.A.',
          quantity: 14,
          symbol: 'PSSA3.SA',
          classSymbol: 'Ação',
        },
        {
          _id: '5fa47a1ff704ca0f84523c02',
          averagePrice: 11.36,
          grade: 6,
          name: 'Itausa Investimentos ITAU SA',
          quantity: 78,
          symbol: 'ITSA4.SA',
          classSymbol: 'Ação',
        },
        {
          _id: '5fa47a4bf704ca0f84523c03',
          averagePrice: 42.44,
          grade: 6,
          name: 'Engie Brasil Energia S.A.',
          quantity: 19,
          symbol: 'EGIE3.SA',
          classSymbol: 'Ação',
        },
        {
          _id: '5fa47a6df704ca0f84523c04',
          averagePrice: 19.98,
          grade: 6,
          name: 'CTEEP - Companhia de Transmissão de Energia Elétrica Paulista S.A.',
          quantity: 45,
          symbol: 'TRPL4.SA',
          classSymbol: 'Ação',
        },
      ],
    },
  },
};

const INVALID_LIST_TICKETS = {
  request: {
    query: GET_TICKETS_BY_WALLET,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', sort: 'grade' },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Sem conexão com o banco de dados.')],
  },
};

const EMPTY_LIST_TICKETS = {
  request: {
    query: GET_TICKETS_BY_WALLET,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', sort: 'grade' },
  },
  result: {
    data: {
      getTicketsByWallet: [],
    },
  },
};
