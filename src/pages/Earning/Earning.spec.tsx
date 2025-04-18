import React from 'react';
import Earning, {
  GET_EARNING_ACC_BY_YEAR,
  GET_EARNING_BY_WALLET,
  GET_SUM_EARNING,
} from './index';
import { render, fireEvent, act, waitFor } from '../../utils/testProvider';

jest.mock('../../utils/currentYear', () => ({
  CURRENT_YEAR: 2022,
}));

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    wallet: '5fa1d752a8c5892a48c69b35',
    handleSetLoading: jest.fn(),
  }),
}));

const mockedInitialMenuTitles = ['Carteira', 'Proventos'];

const mockedHandleChangeMenu = jest.fn();

describe('Earning Tab', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully list earnings', async () => {
    const {
      getByLabelText,
      getAllByLabelText,
      getAllByRole,
      findAllByLabelText,
    } = render(
      <Earning
        handleChangeMenu={mockedHandleChangeMenu}
        initialMenuTitles={mockedInitialMenuTitles}
        selectedMenu="Proventos"
      />,
      [
        SUCCESSFUL_LIST_EARNINGS(2022),
        SUCCESSFUL_SUM_EARNINGS(2022),
        SUCCESSFUL_LIST_EARNINGS(2023),
        SUCCESSFUL_SUM_EARNINGS(2023),
        SUCCESSFUL_LIST_EARNINGS(2021),
        SUCCESSFUL_SUM_EARNINGS(2021),
      ],
    );

    const headers = getAllByRole('header');
    expect(headers[0]).toHaveTextContent(/Carteira/i);
    expect(headers[1]).toHaveTextContent(/Proventos/i);

    const selectedYear = getByLabelText(/^Ano Selecionado$/i);
    expect(selectedYear).toHaveProperty('children', ['2022']);

    const listMonth = await findAllByLabelText(/Mês/i);
    expect(listMonth[0]).toHaveProperty('children', ['Janeiro']);

    const listAmount = getAllByLabelText(/Total do Mês/i);
    expect(listAmount[0]).toHaveProperty('children', ['R$ 100,00']);

    const oldYearAmount = getByLabelText('Ano anterior');
    expect(oldYearAmount).toHaveProperty('children', ['R$ 40,00']);

    const currentYearAmount = getByLabelText('Ano selecionado');
    expect(currentYearAmount).toHaveProperty('children', ['R$ 181,00']);

    getAllByRole('button');
    const nextYearButton = getByLabelText('Próximo Ano');

    await act(async () => fireEvent.press(nextYearButton));
    await waitFor(() =>
      expect(selectedYear).toHaveProperty('children', ['2023']),
    );

    const OldYearButton = getByLabelText('Ano Anterior');
    await act(async () => fireEvent.press(OldYearButton));
    await act(async () => fireEvent.press(OldYearButton));

    await waitFor(() =>
      expect(selectedYear).toHaveProperty('children', ['2021']),
    );
  });
  it('should successfully list earnings accumulated', async () => {
    const {
      getAllByRole,
      getByText,
      getByLabelText,
      getAllByLabelText,
      findByLabelText,
      findAllByLabelText,
    } = render(
      <Earning
        handleChangeMenu={mockedHandleChangeMenu}
        initialMenuTitles={mockedInitialMenuTitles}
        selectedMenu="Proventos"
      />,
      [
        SUCCESSFUL_LIST_EARNINGS(2022),
        SUCCESSFUL_SUM_EARNINGS(2022),
        SUCCESSFUL_LIST_ACC_EARNINGS(),
      ],
    );

    const headers = getAllByRole('header');
    expect(headers[0]).toHaveTextContent(/Carteira/i);
    expect(headers[1]).toHaveTextContent(/Proventos/i);

    const AccFilter = getByText('Acumulado');

    await act(async () => fireEvent.press(AccFilter));

    const selectedYear = getByLabelText(/^Ano Selecionado$/i);
    expect(selectedYear).toHaveProperty('children', ['Todos']);

    const earningTotalAcc = await findByLabelText('Total acumulado');
    expect(earningTotalAcc).toHaveProperty('children', ['R$ 3.000,00']);

    getByText('Yield on cost');
    getByText('(+12.0%)');

    const listYear = await findAllByLabelText('Ano');
    expect(listYear[0]).toHaveProperty('children', ['2022']);

    const listAmount = getAllByLabelText('Total do ano');
    expect(listAmount[0]).toHaveProperty('children', ['R$ 300,00']);
  });
});

const SUCCESSFUL_LIST_EARNINGS = (mockYear: number) => ({
  request: {
    query: GET_EARNING_BY_WALLET,
    variables: { walletID: '5fa1d752a8c5892a48c69b35', year: mockYear },
  },
  result: {
    data: {
      getEarningByWallet: [
        {
          _id: '61d7476ac27faeeb7fcb2fe9',
          year: mockYear,
          month: 1,
          amount: 100,
        },
        {
          _id: '61d748b8c27faeeb7fcb305d',
          year: mockYear,
          month: 2,
          amount: 80.2,
        },
        {
          _id: '61d749cec27faeeb7fcb30a9',
          year: mockYear,
          month: 3,
          amount: 0.8,
        },
        {
          _id: '61d75e89c27faeeb7fcb332b',
          year: mockYear,
          month: 4,
          amount: 0,
        },
        {
          _id: '61d76433c27faeeb7fcb3450',
          year: mockYear,
          month: 5,
          amount: 0,
        },
        {
          _id: '61d76451c27faeeb7fcb3469',
          year: mockYear,
          month: 6,
          amount: 0,
        },
        {
          _id: '61d74df9c27faeeb7fcb3182',
          year: mockYear,
          month: 7,
          amount: 0,
        },
        {
          _id: '8',
          year: mockYear,
          month: 8,
          amount: 0,
        },
        {
          _id: '61d74708c27faeeb7fcb2fd5',
          year: mockYear,
          month: 9,
          amount: 20,
        },
        {
          _id: '61d74656c27faeeb7fcb2fc4',
          year: mockYear,
          month: 10,
          amount: 20,
        },
        {
          _id: '11',
          year: mockYear,
          month: 11,
          amount: 0,
        },
        {
          _id: '12',
          year: mockYear,
          month: 12,
          amount: 0,
        },
      ],
    },
  },
});

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

const SUCCESSFUL_LIST_ACC_EARNINGS = () => ({
  request: {
    query: GET_EARNING_ACC_BY_YEAR,
    variables: { walletID: '5fa1d752a8c5892a48c69b35' },
  },
  result: {
    data: {
      getEarningAccByYear: [
        {
          _id: '2022',
          year: 2022,
          amount: 300,
        },
        {
          _id: '2021',
          year: 2021,
          amount: 250,
        },
        {
          _id: '2020',
          year: 2020,
          amount: 200,
        },
        {
          _id: '2019',
          year: 2019,
          amount: 30,
        },
      ],
    },
  },
});
