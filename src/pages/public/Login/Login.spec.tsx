import React from 'react';
import Login, { LOGIN } from './index';
import { render, fireEvent, waitFor, act } from '../../../utils/testProvider';
import { GraphQLError } from 'graphql';

const mockedHandleSignIn = jest.fn();
const mockedHandleOpenModal = jest.fn();

jest.mock('../../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSignIn: mockedHandleSignIn,
    handleSetLoading: jest.fn(),
  }),
}));

describe('Login Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully login user', async () => {
    const {
      getByText,
      getByPlaceholderText,
      getByDisplayValue,
      getByRole,
      findByRole,
    } = render(
      <Login handleOpenModal={mockedHandleOpenModal} onClose={jest.fn()} />,
      [INVALID_LOGIN_USER, SUCCESSFUL_LOGIN_USER],
    );

    const title = await findByRole('header');
    expect(title).toHaveProperty('children', ['Bem Vindo de Volta']);

    const submitButton = getByRole('button');
    expect(submitButton).toHaveProperty('children', ['Entrar']);

    await act(async () => fireEvent.press(submitButton));

    getByText(/E-mail/i);
    const inputEmail = getByPlaceholderText(/meuemail@teste.com.br/i);
    fireEvent.changeText(inputEmail, 'test@test.com');
    getByDisplayValue('test@test.com');

    getByText(/^Senha$/i);
    const inputPassword = getByPlaceholderText('********');
    fireEvent.changeText(inputPassword, '1234');
    getByDisplayValue('1234');

    await act(async () => fireEvent.press(submitButton));
    await act(async () =>
      waitFor(() => getByText(/Usuário ou Senha não existe./i)),
    );

    fireEvent.changeText(inputPassword, '123');
    getByDisplayValue('123');

    const loginButton = getByText('Entrar');
    await act(async () => fireEvent.press(loginButton));

    expect(mockedHandleSignIn).toHaveBeenCalledWith({
      __typename: 'User',
      _id: 'id_logged',
      token: 'token_logged',
      refreshToken: 'rft_logged',
      role: 'role_logged',
    });
  });

  it('should links work correctly', async () => {
    const { getByText } = render(
      <Login handleOpenModal={mockedHandleOpenModal} onClose={jest.fn()} />,
    );

    const forgotPasswordLink = getByText(/Esqueceu a senha\?/i);
    await act(async () => fireEvent.press(forgotPasswordLink));

    expect(mockedHandleOpenModal).toHaveBeenCalledTimes(1);
    expect(mockedHandleOpenModal).toHaveBeenCalledWith('ForgotPassword');
  });
});

const SUCCESSFUL_LOGIN_USER = {
  request: {
    query: LOGIN,
    variables: {
      email: 'test@test.com',
      password: '123',
    },
  },
  result: {
    data: {
      login: {
        _id: 'id_logged',
        token: 'token_logged',
        refreshToken: 'rft_logged',
        role: 'role_logged',
        __typename: 'User',
      },
    },
  },
};

const INVALID_LOGIN_USER = {
  request: {
    query: LOGIN,
    variables: {
      email: 'test@test.com',
      password: '1234',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Usuário ou Senha não existe.')],
  },
};
