import React from 'react';
import AddWalletModal, { CREATE_WALLET } from './index';
import { DELETE_WALLET, UPDATE_WALLET } from '../EditWallet';
import { render, fireEvent, waitFor, act } from '../../utils/testProvider';
import { GraphQLError } from 'graphql';
import { GET_WALLET_BY_USER } from '../WalletModal';

const mockedhandleResetEditWallet = jest.fn();
const mockedOnClose = jest.fn();
const mockedHandleSetWallet = jest.fn();

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSetWallet: mockedHandleSetWallet,
    handleSetLoading: jest.fn(),
  }),
}));

describe('Add Wallet Modal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create wallet', async () => {
    const {
      findByRole,
      getByRole,
      getByText,
      getByPlaceholderText,
      getByDisplayValue,
      mockOpenModal,
    } = render(<AddWalletModal onClose={mockedOnClose} />, [
      SUCCESSFUL_CREATE_WALLET,
      SUCCESSFUL_LIST_WALLET,
    ]);

    const title = await findByRole('header');
    expect(title).toHaveProperty('children', ['Criar Nova Carteira']);

    const submitButton = getByRole('button');
    expect(submitButton).toHaveProperty('children', ['Criar Carteira']);

    await act(async () => fireEvent.press(submitButton));

    getByText(/Nome da Carteira/i);
    const inputWallet = getByPlaceholderText(/Minha Nova Carteira/i);
    await act(async () => fireEvent.changeText(inputWallet, 'My New Wallet'));
    getByDisplayValue('My New Wallet');

    await act(async () => fireEvent.press(submitButton));

    expect(mockedHandleSetWallet).toHaveBeenCalledWith(
      'id_wallet',
      'My New Wallet',
    );

    await waitFor(() => {
      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockOpenModal).toHaveBeenCalledWith('SUCCESS');
    });
  });

  it('should not allow create wallet', async () => {
    const { getByRole, getByText, getByPlaceholderText, getByDisplayValue } =
      render(<AddWalletModal onClose={mockedOnClose} />, [
        INVALID_CREATE_WALLET,
      ]);

    getByText(/Nome da Carteira/i);
    const inputWallet = getByPlaceholderText(/Minha Nova Carteira/i);
    await act(async () => fireEvent.changeText(inputWallet, 'My New Wallet 3'));
    getByDisplayValue('My New Wallet 3');

    const submitButton = getByRole('button');
    await act(async () => fireEvent.press(submitButton));

    getByText(/Wallets são limitadas a 2 quantidades./i);

    expect(mockedHandleSetWallet).not.toHaveBeenCalled();
  });

  it('should links work correctly', async () => {
    const { getByRole } = render(<AddWalletModal onClose={mockedOnClose} />);

    const iconBackButton = getByRole('imagebutton');
    expect(iconBackButton).toBeTruthy();
    await act(async () => fireEvent.press(iconBackButton));

    expect(mockedOnClose).toHaveBeenCalledTimes(1);
  });

  it('should successfully update wallet', async () => {
    const {
      findByRole,
      getAllByRole,
      getByPlaceholderText,
      getByDisplayValue,
      findByText,
      mockOpenConfirmModal,
      mockOpenModal,
    } = render(
      <AddWalletModal
        onClose={mockedOnClose}
        handleResetEditWallet={mockedhandleResetEditWallet}
        walletData={{
          _id: 'id_wallet',
          description: 'My Wallet',
        }}
      />,
      [SUCCESSFUL_UPDATE_WALLET, SUCCESSFUL_LIST_WALLET],
    );

    const title = await findByRole('header');
    expect(title).toHaveProperty('children', ['Alterar Carteira']);

    await findByText(/Nome da Carteira/i);
    const inputWallet = getByPlaceholderText(/Minha Nova Carteira/i);
    expect(inputWallet.props.defaultValue).toBe('My Wallet');

    await act(async () => fireEvent.changeText(inputWallet, 'My Edit Wallet'));
    getByDisplayValue('My Edit Wallet');

    const submitButton = getAllByRole('button')[0];
    expect(submitButton).toHaveProperty('children', ['Alterar Carteira']);

    await act(async () => fireEvent.press(submitButton));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);

    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja alterar a carteira?',
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    await waitFor(() => {
      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockOpenModal).toHaveBeenCalledWith('SUCCESS');
    });

    expect(mockedhandleResetEditWallet).toHaveBeenCalledTimes(1);
  });

  it('should successfully delete wallet', async () => {
    const {
      findAllByRole,
      findByText,
      getByPlaceholderText,
      mockOpenModal,
      mockOpenConfirmModal,
    } = render(
      <AddWalletModal
        onClose={mockedOnClose}
        handleResetEditWallet={mockedhandleResetEditWallet}
        walletData={{
          _id: 'id_wallet',
          description: 'My Wallet',
        }}
      />,
      [SUCCESSFUL_DELETE_WALLET, SUCCESSFUL_LIST_WALLET],
    );

    await findByText(/Nome da Carteira/i);
    const inputWallet = getByPlaceholderText(/Minha Nova Carteira/i);
    expect(inputWallet.props.defaultValue).toBe('My Wallet');

    const submitButton = await findAllByRole('button');
    expect(submitButton[1]).toHaveProperty('children', ['Excluir Carteira']);

    await act(async () => fireEvent.press(submitButton[1]));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);

    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja excluir a carteira?',
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    await waitFor(() => {
      expect(mockOpenModal).toHaveBeenCalledTimes(1);
      expect(mockOpenModal).toHaveBeenCalledWith('SUCCESS');
    });

    expect(mockedhandleResetEditWallet).toHaveBeenCalledTimes(1);
  });
});

const SUCCESSFUL_CREATE_WALLET = {
  request: {
    query: CREATE_WALLET,
    variables: {
      description: 'My New Wallet',
    },
  },
  result: {
    data: {
      createWallet: {
        _id: 'id_wallet',
        description: 'My New Wallet',
        __typename: 'Wallet',
      },
    },
  },
};

const INVALID_CREATE_WALLET = {
  request: {
    query: CREATE_WALLET,
    variables: {
      description: 'My New Wallet 3',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Wallets são limitadas a 2 quantidades.')],
  },
};

const SUCCESSFUL_UPDATE_WALLET = {
  request: {
    query: UPDATE_WALLET,
    variables: {
      _id: 'id_wallet',
      description: 'My Edit Wallet',
    },
  },
  result: {
    data: {
      updateWallet: {
        _id: 'id_wallet',
        description: 'My Edit Wallet',
        __typename: 'Wallet',
      },
    },
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

const SUCCESSFUL_DELETE_WALLET = {
  request: {
    query: DELETE_WALLET,
    variables: {
      _id: 'id_wallet',
    },
  },
  result: {
    data: {
      deleteWallet: true,
    },
  },
};
