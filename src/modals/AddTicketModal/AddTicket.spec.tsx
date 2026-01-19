import React from 'react';
import AddTicket, { CREATE_TICKET } from './index';
import { UPDATE_TICKET, DELETE_TICKET } from '../EditTicket';
import { GET_TICKETS_BY_WALLET } from '../../graphql/queries';
import { render, fireEvent, act, waitFor } from '../../utils/testProvider';
import { GraphQLError } from 'graphql';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { GET_WALLET_BY_USER } from '../../modals/WalletModal';
import { GET_SUM_EARNING } from '../../pages/Earning';

const apiMock = new MockAdapter(api);

jest.mock('../../utils/currentYear', () => ({
  CURRENT_YEAR: 2022,
}));

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    wallet: '5fa1d752a8c5892a48c69b35',
    handleSetLoading: jest.fn(),
    showBanner: false,
  }),
}));

describe('AddTicket Tab', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create ticket', async () => {
    apiMock.onGet('/search?').reply(200, {
      quotes: [
        {
          symbol: 'SAPR4.SA',
          longname: 'Companhia de Saneamento do Paraná - SANEPAR',
        },
      ],
    });

    const {
      findByRole,
      getAllByRole,
      getByText,
      getByPlaceholderText,
      getByDisplayValue,
      mockOpenModal,
    } = render(<AddTicket />, [
      SUCCESSFUL_CREATE_TICKET,
      SUCCESSFUL_LIST_TICKETS('symbol'),
      SUCCESSFUL_LIST_TICKETS('grade'),
      SUCCESSFUL_LIST_WALLET,
      SUCCESSFUL_SUM_EARNINGS(2022),
    ]);

    const title = await findByRole('header');
    expect(title).toHaveProperty('children', ['Adicionar Ativo']);

    const submitButton = getAllByRole('button')[1];
    expect(submitButton).toHaveProperty('children', ['Adicionar']);

    await act(async () => fireEvent.press(submitButton));

    const suggestButton = getAllByRole('button')[0];
    expect(suggestButton).toHaveProperty('children', [
      'Clique para buscar e selecione um ativo',
    ]);

    getByText(/Ativo Selecionado/i);
    const inputSelectedTicket = getByPlaceholderText(
      /Nenhum ativo selecionado/i
    );

    await act(async () => fireEvent.press(suggestButton));

    getByText(/Pesquise e selecione um ativo/i);
    const inputSuggestions = getByPlaceholderText(/RBLC3/i);
    fireEvent.changeText(inputSuggestions, 'SAPR4');
    getByDisplayValue('SAPR4');

    await waitFor(() => {
      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(2);
    });

    const itemList = getAllByRole('button')[2];
    await act(async () => fireEvent.press(itemList));

    getByText(/Dê uma Nota/i);
    const inputGrade = getByPlaceholderText(/0 a 100/i);
    fireEvent.changeText(inputGrade, '6');
    getByDisplayValue('6');

    getByText(/Preço Médio/i);
    const inputAveragePrice = getByPlaceholderText(/Preço Médio de Compra/i);
    fireEvent.changeText(inputAveragePrice, '5,42');
    getByDisplayValue('R$ 5.42');

    getByText(/Quantidade/i);
    const inputQuantity = getByPlaceholderText(/9999/i);
    fireEvent.changeText(inputQuantity, '174');
    getByDisplayValue('174');

    expect(inputSelectedTicket.props.value).toBe('SAPR4');

    await act(async () => fireEvent.press(submitButton));

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    expect(mockOpenModal).toHaveBeenCalledWith('SUCCESS');
  });

  it('should successfully edit ticket', async () => {
    const {
      findByRole,
      getAllByRole,
      getByLabelText,
      getByDisplayValue,
      mockOpenConfirmModal,
      mockOpenModal,
    } = render(
      <AddTicket contentModal={MOCKED_PARAMS} />,
      [
        SUCCESSFUL_EDIT_TICKET,
        SUCCESSFUL_LIST_TICKETS('symbol'),
        SUCCESSFUL_LIST_TICKETS('grade'),
        SUCCESSFUL_LIST_WALLET,
        SUCCESSFUL_SUM_EARNINGS(2022),
      ],
      MOCKED_PARAMS
    );

    const title = await findByRole('header');
    expect(title).toHaveProperty('children', ['Alterar Ativo']);

    getByLabelText(/Ativo Selecionado/i);
    getByDisplayValue(/SAPR4/i);

    getByLabelText(/Dê uma Nota/i);
    const inputGrade = getByDisplayValue(/6/i);
    fireEvent.changeText(inputGrade, '10');
    expect(inputGrade.props.value).toBe('10');

    getByLabelText(/Dê uma Nota/i);
    const inputAveragePrice = getByDisplayValue('R$ 5.42');
    fireEvent.changeText(inputAveragePrice, '4,30');
    expect(inputAveragePrice.props.value).toBe('R$ 4.30');

    getByLabelText(/Quantidade/i);
    const inputQuantity = getByDisplayValue(/174/i);
    fireEvent.changeText(inputQuantity, '200');
    expect(inputQuantity.props.value).toBe('200');

    const submitButton = getAllByRole('button')[0];
    expect(submitButton).toHaveProperty('children', ['Alterar Ativo']);

    await act(async () => fireEvent.press(submitButton));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);

    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja alterar o ativo?'
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    await waitFor(() => {
      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockOpenModal).toHaveBeenCalledWith('SUCCESS');
    });
  });

  it('should successfully delete ticket', async () => {
    const { findAllByRole, mockOpenConfirmModal, mockOpenModal } = render(
      <AddTicket contentModal={MOCKED_PARAMS} />,
      [
        SUCCESSFUL_DELETE_TICKET,
        SUCCESSFUL_LIST_TICKETS('symbol'),
        SUCCESSFUL_LIST_TICKETS('grade'),
        SUCCESSFUL_LIST_WALLET,
        SUCCESSFUL_SUM_EARNINGS(2022),
      ],
      MOCKED_PARAMS
    );

    const submitButton = await findAllByRole('button');
    expect(submitButton[1]).toHaveProperty('children', ['Excluir Ativo']);

    await act(async () => fireEvent.press(submitButton[1]));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);

    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja excluir o ativo?'
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    await waitFor(() => {
      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockOpenModal).toHaveBeenCalledWith('SUCCESS');
    });
  });

  it('should throw error on create ticket', async () => {
    apiMock.onGet('/search?').reply(200, {
      quotes: [
        {
          symbol: 'SAPR4.SA',
          longname: 'Companhia de Saneamento do Paraná - SANEPAR',
        },
      ],
    });

    const { getAllByRole, getByText, getByPlaceholderText, getByDisplayValue } =
      render(<AddTicket />, [INVALID_CREATE_TICKET]);

    const suggestButton = getAllByRole('button')[0];
    await act(async () => fireEvent.press(suggestButton));

    const inputSelectedTicket = getByPlaceholderText(
      /Nenhum ativo selecionado/i
    );

    getByText(/Pesquise e selecione um ativo/i);
    const inputSuggestions = getByPlaceholderText(/RBLC3/i);

    await act(async () => fireEvent.changeText(inputSuggestions, 'SAPR4'));
    getByDisplayValue('SAPR4');

    await waitFor(() => {
      const itemList = getAllByRole('button');
      expect(itemList.length).toBeGreaterThan(2);
    });

    const itemList = getAllByRole('button')[2];
    await act(async () => fireEvent.press(itemList));

    expect(inputSelectedTicket.props.value).toBe('SAPR4');

    const inputGrade = getByPlaceholderText(/0 a 100/i);
    fireEvent.changeText(inputGrade, '6');

    const inputAveragePrice = getByPlaceholderText(/Preço Médio de Compra/i);
    fireEvent.changeText(inputAveragePrice, '5,42');

    const inputQuantity = getByPlaceholderText(/9999/i);
    fireEvent.changeText(inputQuantity, '174');

    const submitButton = getAllByRole('button')[1];
    expect(submitButton).toHaveProperty('children', ['Adicionar']);

    await act(async () => fireEvent.press(submitButton));

    await act(async () => getByText(/Ativo já cadastrado./i));
  });

  it('should throw error on edit ticket', async () => {
    const { findAllByRole, findByText, mockOpenConfirmModal } = render(
      <AddTicket contentModal={MOCKED_PARAMS} />,
      [INVALID_EDIT_TICKET],
      MOCKED_PARAMS
    );

    const submitButton = await findAllByRole('button');
    expect(submitButton[0]).toHaveProperty('children', ['Alterar Ativo']);

    await act(async () => fireEvent.press(submitButton[0]));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);

    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja alterar o ativo?'
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    findByText(/Sem conexão com o banco de dados./i);
  });

  it('should throw error on delete ticket', async () => {
    const { findAllByRole, findByText, mockOpenConfirmModal } = render(
      <AddTicket contentModal={MOCKED_PARAMS} />,
      [INVALID_DELETE_TICKET],
      MOCKED_PARAMS
    );

    const submitButton = await findAllByRole('button');
    expect(submitButton[1]).toHaveProperty('children', ['Excluir Ativo']);

    await act(async () => fireEvent.press(submitButton[1]));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);

    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja excluir o ativo?'
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    findByText(/Sem conexão com o banco de dados./i);
  });
});

const MOCKED_PARAMS = {
  ticket: {
    __typename: 'Ticket',
    _id: '5fa479c9f704ca0f84523c00',
    averagePrice: 5.42,
    grade: 6,
    name: 'Companhia de Saneamento do Paraná - SANEPAR',
    quantity: 174,
    symbol: 'SAPR4.SA',
  },
};

const SUCCESSFUL_CREATE_TICKET = {
  request: {
    query: CREATE_TICKET,
    variables: {
      walletID: '5fa1d752a8c5892a48c69b35',
      symbol: 'SAPR4.SA',
      name: 'Companhia de Saneamento do Paraná - SANEPAR',
      quantity: 174,
      averagePrice: 5.42,
      grade: 6,
    },
  },
  result: {
    data: {
      createTicket: {
        __typename: 'Ticket',
        _id: '5fa479c9f704ca0f84523c00',
        averagePrice: 5.42,
        grade: 6,
        name: 'Companhia de Saneamento do Paraná - SANEPAR',
        quantity: 174,
        symbol: 'SAPR4.SA',
      },
    },
  },
};

const SUCCESSFUL_LIST_TICKETS = (sort: string) => ({
  request: {
    query: GET_TICKETS_BY_WALLET,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', sort: sort },
  },
  result: {
    data: {
      getTicketsByWallet: [
        {
          __typename: 'Ticket',
          _id: '5fa479c9f704ca0f84523c00',
          averagePrice: 5.42,
          grade: 6,
          name: 'Companhia de Saneamento do Paraná - SANEPAR',
          quantity: 174,
          symbol: 'SAPR4.SA',
        },
        {
          __typename: 'Ticket',
          _id: '5fa479f7f704ca0f84523c01',
          averagePrice: 54.76,
          grade: 6,
          name: 'Porto Seguro S.A.',
          quantity: 14,
          symbol: 'PSSA3.SA',
        },
        {
          __typename: 'Ticket',
          _id: '5fa47a1ff704ca0f84523c02',
          averagePrice: 11.36,
          grade: 6,
          name: 'Itausa Investimentos ITAU SA',
          quantity: 78,
          symbol: 'ITSA4.SA',
        },
        {
          __typename: 'Ticket',
          _id: '5fa47a4bf704ca0f84523c03',
          averagePrice: 42.44,
          grade: 6,
          name: 'Engie Brasil Energia S.A.',
          quantity: 19,
          symbol: 'EGIE3.SA',
        },
        {
          __typename: 'Ticket',
          _id: '5fa47a6df704ca0f84523c04',
          averagePrice: 19.98,
          grade: 6,
          name: 'CTEEP - Companhia de Transmissão de Energia Elétrica Paulista S.A.',
          quantity: 45,
          symbol: 'TRPL4.SA',
        },
      ],
    },
  },
});

const SUCCESSFUL_EDIT_TICKET = {
  request: {
    query: UPDATE_TICKET,
    variables: {
      _id: '5fa479c9f704ca0f84523c00',
      symbol: 'SAPR4.SA',
      name: 'Companhia de Saneamento do Paraná - SANEPAR',
      quantity: 200,
      averagePrice: 4.3,
      grade: 10,
    },
  },
  result: {
    data: {
      createTicket: {
        __typename: 'Ticket',
        _id: '5fa479c9f704ca0f84523c00',
      },
    },
  },
};

const SUCCESSFUL_DELETE_TICKET = {
  request: {
    query: DELETE_TICKET,
    variables: {
      _id: '5fa479c9f704ca0f84523c00',
      walletID: '5fa1d752a8c5892a48c69b35',
    },
  },
  result: {
    data: {
      deleteTicket: true,
    },
  },
};

const INVALID_CREATE_TICKET = {
  request: {
    query: CREATE_TICKET,
    variables: {
      walletID: '5fa1d752a8c5892a48c69b35',
      symbol: 'SAPR4.SA',
      name: 'Companhia de Saneamento do Paraná - SANEPAR',
      quantity: 174,
      averagePrice: 5.42,
      grade: 6,
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Ativo já cadastrado.')],
  },
};

const INVALID_EDIT_TICKET = {
  request: {
    query: UPDATE_TICKET,
    variables: {
      _id: '5fa479c9f704ca0f84523c00',
      averagePrice: 5.42,
      grade: 6,
      name: 'Companhia de Saneamento do Paraná - SANEPAR',
      quantity: 174,
      symbol: 'SAPR4.SA',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Sem conexão com o banco de dados.')],
  },
};

const INVALID_DELETE_TICKET = {
  request: {
    query: DELETE_TICKET,
    variables: {
      _id: '5fa479c9f704ca0f84523c00',
      walletID: '5fa1d752a8c5892a48c69b35',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Sem conexão com o banco de dados.')],
  },
};

const SUCCESSFUL_LIST_WALLET = {
  request: {
    query: GET_WALLET_BY_USER,
  },
  result: {
    data: {
      getWalletByUser: [
        {
          __typename: 'Wallet',
          _id: '5fa1d752a8c5892a48c69b35',
          description: 'Nova cart',
          percentPositionWallet: 98.80731603572947,
          percentRentabilityWallet: 1.59902029391182,
          sumAmountAllWallet: 5877.5,
          sumAmountWallet: 5807.4,
          sumCostWallet: 5716,
        },
        {
          __typename: 'Wallet',
          _id: '5faea26914131f13ecb37538',
          description: 'MINHA CARTEIRA ADM',
          percentPositionWallet: 1.192683964270523,
          percentRentabilityWallet: 13.06451612903225,
          sumAmountAllWallet: 5877.5,
          sumAmountWallet: 70.1,
          sumCostWallet: 62,
        },
      ],
    },
  },
};

const SUCCESSFUL_SUM_EARNINGS = (mockYear: number) => ({
  request: {
    query: GET_SUM_EARNING,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', year: mockYear },
  },
  result: {
    data: {
      getSumEarning: {
        sumCurrentYear: 181,
        sumOldYear: 40,
        sumTotalEarnings: 3000,
        yieldOnCost: 12,
      },
    },
  },
});
