import React from 'react';
import EditEarningModal, { UPDATE_EARNING } from './index';
import { render, fireEvent, waitFor, act } from '../../utils/testProvider';
import {
  GET_EARNING_ACC_BY_YEAR,
  GET_EARNING_BY_WALLET,
  GET_SUM_EARNING,
} from '../../pages/Earning';

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    wallet: '5fa1d752a8c5892a48c69b35',
    handleSetLoading: jest.fn(),
  }),
}));

const mockedOnClose = jest.fn();
const mockedEarningData = ({ isEdit = true }: { isEdit?: boolean }) => ({
  _id: isEdit ? '61b1252be98ba56e1525fdf7' : '1',
  year: 2022,
  month: 2,
  amount: isEdit ? 20 : 0,
});

describe('Edit Earning Modal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully edit earning', async () => {
    const {
      findByA11yRole,
      getByA11yRole,
      getByText,
      getByPlaceholderText,
      getByDisplayValue,
      mockOpenConfirmModal,
    } = render(
      <EditEarningModal
        onClose={mockedOnClose}
        earningData={mockedEarningData({ isEdit: true })}
      />,
      [
        SUCCESSFUL_UPDATE_EARNING({ isEdit: true }),
        SUCCESSFUL_LIST_EARNINGS(2022),
        SUCCESSFUL_SUM_EARNINGS(2022),
        SUCCESSFUL_SUM_EARNINGS(2023),
        SUCCESSFUL_SUM_EARNINGS(2021),
        SUCCESSFUL_LIST_ACC_EARNINGS(),
      ],
    );

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Lançamento Manual']);

    getByText('Total de Fevereiro');
    const inputEarning = getByPlaceholderText('R$ 0000,00');
    getByDisplayValue('R$ 20,00');

    await act(async () => fireEvent.changeText(inputEarning, 'R$ 100,00'));

    const submitButton = getByA11yRole('button');
    expect(submitButton).toHaveProperty('children', ['Alterar Valor']);

    await act(async () => fireEvent.press(submitButton));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConfirmModal).toHaveBeenCalledWith({
      description: 'Tem certeza que deseja alterar o valor do provento?',
      onConfirm: expect.any(Function),
    });

    await act(async () => mockOpenConfirmModal.mock.calls[0][0].onConfirm());

    expect(mockedOnClose).toHaveBeenCalledTimes(1);
  });

  it('should successfully add new earning', async () => {
    const {
      findByA11yRole,
      getByA11yRole,
      getByText,
      getByPlaceholderText,
      mockOpenConfirmModal,
    } = render(
      <EditEarningModal
        onClose={mockedOnClose}
        earningData={mockedEarningData({ isEdit: false })}
      />,
      [
        SUCCESSFUL_UPDATE_EARNING({ isEdit: false }),
        SUCCESSFUL_LIST_EARNINGS(2022),
        SUCCESSFUL_SUM_EARNINGS(2022),
        SUCCESSFUL_SUM_EARNINGS(2023),
        SUCCESSFUL_SUM_EARNINGS(2021),
        SUCCESSFUL_LIST_ACC_EARNINGS(),
      ],
    );

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Lançamento Manual']);

    getByText('Total de Fevereiro');
    const inputEarning = getByPlaceholderText('R$ 0000,00');

    act(() => fireEvent.changeText(inputEarning, 'R$ 100,00'));

    const submitButton = getByA11yRole('button');
    expect(submitButton).toHaveProperty('children', ['Alterar Valor']);

    act(() => fireEvent.press(submitButton));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConfirmModal).toHaveBeenCalledWith({
      description: 'Tem certeza que deseja alterar o valor do provento?',
      onConfirm: expect.any(Function),
    });

    await act(async () => mockOpenConfirmModal.mock.calls[0][0].onConfirm());

    expect(mockedOnClose).toHaveBeenCalledTimes(1);
  });
});

const SUCCESSFUL_UPDATE_EARNING = ({
  isEdit = true,
}: {
  isEdit?: boolean;
}) => ({
  request: {
    query: UPDATE_EARNING,
    variables: {
      _id: isEdit ? '61b1252be98ba56e1525fdf7' : null,
      walletID: '5fa1d752a8c5892a48c69b35',
      year: 2022,
      month: 2,
      amount: 100,
    },
  },
  result: {
    data: {
      updateEarning: {
        _id: '61b1252be98ba56e1525fdf7',
        walletID: '5fa1d752a8c5892a48c69b35',
        year: 2022,
        month: 2,
        amount: 100,
      },
    },
  },
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
          amount: 30.55,
        },
      ],
    },
  },
});
