import React from 'react';
import UpdateUserModal from './index';
import { render, fireEvent, waitFor, act } from '../../utils/testProvider';
import { GraphQLError } from 'graphql';
import { UPDATE_USER } from '../../graphql/mutations';
import { GET_USER_BY_TOKEN } from '../../graphql/queries';

const mockedOnClose = jest.fn();
const mockedHandleSignOut = jest.fn();

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSignOut: mockedHandleSignOut,
    handleSetLoading: jest.fn(),
  }),
}));

describe('Update User Modal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update user', async () => {
    const {
      findByRole,
      getAllByRole,
      getByText,
      getByPlaceholderText,
      getByDisplayValue,
      findByText,
      mockOpenConfirmModal,
    } = render(<UpdateUserModal onClose={mockedOnClose} />, [
      SUCCESSFUL_GET_USER_BY_TOKEN,
      SUCCESSFUL_UPDATE_USER,
      SUCCESSFUL_GET_USER_BY_TOKEN,
    ]);

    const title = await findByRole('header');
    expect(title).toHaveProperty('children', ['Minha Conta']);

    await findByText(/E-mail/i);
    const inputEmail = getByPlaceholderText(/meuemail@teste.com.br/i);
    expect(inputEmail.props.defaultValue).toBe('exemple@test.com');

    await act(async () =>
      fireEvent.changeText(inputEmail, 'testeupdate@teste.com'),
    );
    getByDisplayValue('testeupdate@teste.com');

    getByText(/Nova Senha/i);
    const inputPassword = getByPlaceholderText('Caso queira alterar');
    await act(async () => fireEvent.changeText(inputPassword, '1234'));
    getByDisplayValue('1234');

    const submitButton = getAllByRole('button')[0];
    expect(submitButton).toHaveProperty('children', ['Alterar Senha']);

    await act(async () => fireEvent.press(submitButton));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja alterar a senha?',
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    await waitFor(() => expect(mockedOnClose).toHaveBeenCalledTimes(1));
  });

  it('should successfully disabled user', async () => {
    const { findAllByRole, mockOpenConfirmModal } = render(
      <UpdateUserModal onClose={mockedOnClose} />,
      [
        SUCCESSFUL_GET_USER_BY_TOKEN,
        SUCCESSFUL_DISABLED_USER,
        SUCCESSFUL_GET_USER_BY_TOKEN,
      ],
    );

    const disabledButton = await findAllByRole('button');
    expect(disabledButton[1]).toHaveProperty('children', ['Desativar Conta']);

    await act(async () => fireEvent.press(disabledButton[1]));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja desativar a conta?',
    );
    expect(mockOpenConfirmModal.mock.calls[0][0].legend).toBe(
      'Se você continuar, sua conta será desativada e perderá o acesso a ela.',
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    await waitFor(() => expect(mockedHandleSignOut).toHaveBeenCalledTimes(1));
  });

  it('should throw error when update user', async () => {
    const {
      findAllByRole,
      getByText,
      getByPlaceholderText,
      findByText,
      mockOpenConfirmModal,
    } = render(<UpdateUserModal onClose={mockedOnClose} />, [
      SUCCESSFUL_GET_USER_BY_TOKEN,
      INVALID_UPDATE_USER,
    ]);

    const submitButton = await findAllByRole('button');

    await findByText(/E-mail/i);
    const inputEmail = getByPlaceholderText(/meuemail@teste.com.br/i);
    expect(inputEmail.props.defaultValue).toBe('exemple@test.com');

    fireEvent.changeText(inputEmail, 'testeupdate@teste.com');

    await act(async () => fireEvent.press(submitButton[0]));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja alterar a senha?',
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    await findByText(/Sem conexão com o banco de dados./i);
  });

  it('should throw error when get user by token', async () => {
    const { findByText } = render(<UpdateUserModal onClose={mockedOnClose} />, [
      INVALID_GET_USER_BY_TOKEN,
    ]);

    await findByText(/Sem conexão com o banco de dados./i);
  });
});

const SUCCESSFUL_UPDATE_USER = {
  request: {
    query: UPDATE_USER,
    variables: {
      email: 'testeupdate@teste.com',
      password: '1234',
    },
  },
  result: {
    data: {
      updateUser: {
        _id: '5fa1d103a8c5892a48c69b31',
        email: 'testeupdate@teste.com',
        active: true,
        checkTerms: true,
        __typename: 'User',
      },
    },
  },
};

const SUCCESSFUL_GET_USER_BY_TOKEN = {
  request: {
    query: GET_USER_BY_TOKEN,
  },
  result: {
    data: {
      getUserByToken: {
        _id: '5fa1d103a8c5892a48c69b31',
        email: 'exemple@test.com',
        role: 'USER',
        checkTerms: true,
        active: true,
        __typename: 'User',
      },
    },
  },
};

const SUCCESSFUL_DISABLED_USER = {
  request: {
    query: UPDATE_USER,
    variables: {
      active: false,
    },
  },
  result: {
    data: {
      updateUser: {
        _id: '5fa1d103a8c5892a48c69b31',
        email: 'testeupdate@teste.com',
        active: false,
        checkTerms: true,
        __typename: 'User',
      },
    },
  },
};

const INVALID_UPDATE_USER = {
  request: {
    query: UPDATE_USER,
    variables: {
      email: 'testeupdate@teste.com',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Sem conexão com o banco de dados.')],
  },
};

const INVALID_GET_USER_BY_TOKEN = {
  request: {
    query: GET_USER_BY_TOKEN,
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Sem conexão com o banco de dados.')],
  },
};
