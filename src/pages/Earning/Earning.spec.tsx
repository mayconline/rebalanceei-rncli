import React from 'react';
import Earning, { GET_EARNING_BY_WALLET, GET_SUM_EARNING } from './index';
import { render, fireEvent, act, waitFor } from '../../utils/testProvider';

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    wallet: '5fa1d752a8c5892a48c69b35',
    handleSetLoading: jest.fn(),
  }),
}));

const mockedInitialMenuTitles = ['Carteira', 'Proventos'];

const mockedHandleChangeMenu = jest.fn();

describe('Earning Tab', () => {
  it('should successfully list earnings', async () => {
    const {
      findAllByA11yRole,
      getByText,
      findAllByA11yLabel,
      getByA11yLabel,
      getAllByA11yLabel,
      getAllByA11yRole,
    } = render(
      <Earning
        handleChangeMenu={mockedHandleChangeMenu}
        initialMenuTitles={mockedInitialMenuTitles}
        selectedMenu="Proventos"
      />,
      [SUCCESSFUL_LIST_EARNINGS(2022), SUCCESSFUL_SUM_EARNINGS(2022)],
    );

    await findAllByA11yRole('header');
    getByText('Proventos');

    const selectedYear = getByA11yLabel(/^Ano Selecionado$/i);
    expect(selectedYear).toHaveProperty('children', ['2022']);

    const listMonth = await findAllByA11yLabel(/Mês/i);
    expect(listMonth[0]).toHaveProperty('children', ['Janeiro']);

    const listAmount = getAllByA11yLabel(/Total do Mês/i);
    expect(listAmount[0]).toHaveProperty('children', ['R$ 100,00']);

    const oldYearAmount = getByA11yLabel('Total de Proventos do Ano Anterior');
    expect(oldYearAmount).toHaveProperty('children', ['R$ 40,00']);

    const currentYearAmount = getByA11yLabel(
      'Total de Proventos do Ano Selecionado',
    );
    expect(currentYearAmount).toHaveProperty('children', ['R$ 181,00']);

    getAllByA11yRole('button');
    const nextYearButton = getByA11yLabel('Próximo Ano');

    act(() => fireEvent.press(nextYearButton));
    await waitFor(() =>
      expect(selectedYear).toHaveProperty('children', ['2023']),
    );

    const OldYearButton = getByA11yLabel('Ano Anterior');
    act(() => fireEvent.press(OldYearButton));
    act(() => fireEvent.press(OldYearButton));

    await waitFor(() =>
      expect(selectedYear).toHaveProperty('children', ['2021']),
    );
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
      },
    },
  },
});
