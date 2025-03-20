import React from 'react';
import SignUp, { CREATE_USER } from './index';
import { render, fireEvent, waitFor, act } from '../../../utils/testProvider';
import * as Terms from '../../../utils/Terms';
import { GraphQLError } from 'graphql';

const mockedHandleSignIn = jest.fn();

const mockedTerms = jest.spyOn(Terms, 'getTerms');

jest.mock('../../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSignIn: mockedHandleSignIn,
    handleSetLoading: jest.fn(),
  }),
}));

describe('SignUp Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create user', async () => {
    const {
      getByText,
      getAllByText,
      getByPlaceholderText,
      getByDisplayValue,
      getByA11yRole,
      findByA11yRole,
      mockOpenConfirmModal,
    } = render(<SignUp onClose={jest.fn()} />, [
      INVALID_USER,
      SUCCESSFUL_CREATE_USER,
    ]);

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Criar Conta']);

    const submitButton = getByA11yRole('button');
    expect(submitButton).toHaveProperty('children', ['Criar Conta']);

    await act(async () => fireEvent.press(submitButton));

    getByText(/E-mail/i);
    const inputEmail = getByPlaceholderText(/meuemail@teste.com.br/i);
    await act(async () =>
      fireEvent.changeText(inputEmail, 'userexists@test.com'),
    );
    getByDisplayValue('userexists@test.com');

    getByText(/Senha/i);
    const inputPassword = getByPlaceholderText('********');
    await act(async () => fireEvent.changeText(inputPassword, '123'));
    getByDisplayValue('123');

    getByText(/Aceito os Termos de Uso e Política de Privacidade/i);

    const switchTerms = getByA11yRole('switch');
    expect(switchTerms).toBeTruthy();

    await act(async () => fireEvent.press(submitButton));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Termos de Uso e Política de Privacidade',
    );
    expect(mockOpenConfirmModal.mock.calls[0][0].legend).toBe(
      'É preciso aceitar os termos de uso para utilizar o app.',
    );

    await act(async () => mockOpenConfirmModal.mock.calls[0][0].onConfirm());

    await act(async () => fireEvent.press(submitButton));
    getByText(/Usuário Já Existe./i);

    fireEvent.changeText(inputEmail, 'test@test.com');
    getByDisplayValue('test@test.com');

    const registerButton = getAllByText('Criar Conta')[1];
    await act(async () => fireEvent.press(registerButton));

    await waitFor(() =>
      expect(mockedHandleSignIn).toHaveBeenCalledWith({
        __typename: 'User',
        _id: 'id_created',
        token: 'token_created',
        refreshToken: 'rft_logged',
        role: 'role_logged',
      }),
    );
  });

  it('should links work correctly', async () => {
    const { getByText } = render(<SignUp onClose={jest.fn()} />);

    const termsLink = getByText(
      /Aceito os Termos de Uso e Política de Privacidade/i,
    );
    await act(async () => fireEvent.press(termsLink));
    expect(mockedTerms).toHaveBeenCalledTimes(1);
  });
});

const SUCCESSFUL_CREATE_USER = {
  request: {
    query: CREATE_USER,
    variables: {
      email: 'test@test.com',
      password: '123',
      checkTerms: true,
    },
  },
  result: {
    data: {
      createUser: {
        _id: 'id_created',
        token: 'token_created',
        refreshToken: 'rft_logged',
        role: 'role_logged',
        __typename: 'User',
      },
    },
  },
};

const INVALID_USER = {
  request: {
    query: CREATE_USER,
    variables: {
      email: 'userexists@test.com',
      password: '123',
      checkTerms: true,
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Usuário Já Existe.')],
  },
};
