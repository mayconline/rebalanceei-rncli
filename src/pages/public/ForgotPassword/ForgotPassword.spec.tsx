import React from 'react';
import { Alert } from 'react-native';
import ForgotPassword, { SEND_RECOVERY } from './index';
import { render, fireEvent, waitFor, act } from '../../../utils/testProvider';
import { GraphQLError } from 'graphql';

const mockedAlert = (Alert.alert = jest.fn());

jest.mock('../../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSetLoading: jest.fn(),
  }),
}));

describe('ForgotPassword Page', () => {
  it('should successfully send recovery', async () => {
    const {
      getByText,
      getAllByText,
      getByPlaceholderText,
      getByDisplayValue,
      getByA11yRole,
      findByA11yRole,
      navigate,
    } = render(<ForgotPassword />, [INVALID_USER, SUCCESSFUL_SEND_RECOVERY]);

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Recuperar Senha']);

    const submitButton = getByA11yRole('button');
    expect(submitButton).toHaveProperty('children', ['Recuperar Senha']);

    fireEvent.press(submitButton);

    getByText(/E-mail/i);
    const inputEmail = getByPlaceholderText(/meuemail@teste.com.br/i);
    fireEvent.changeText(inputEmail, 'usernotexists@test.com');
    getByDisplayValue('usernotexists@test.com');

    fireEvent.press(submitButton);
    await waitFor(() => getByText(/Usuário Não Existe./i));

    fireEvent.changeText(inputEmail, 'test@test.com');
    getByDisplayValue('test@test.com');

    const sendButton = getAllByText('Recuperar Senha')[1];
    fireEvent.press(sendButton);

    await waitFor(() => expect(mockedAlert).toHaveBeenCalledTimes(1));
    expect(mockedAlert.mock.calls[0][0]).toBe('Verifique seu e-mail');
    expect(mockedAlert.mock.calls[0][1]).toBe(
      'Um código de redefinição de senha foi enviado para seu e-mail.',
    );

    act(() => mockedAlert.mock.calls[0][2][0].onPress());

    expect(navigate).toHaveBeenCalledWith('ChangePassword', {
      email: 'test@test.com',
    });
  });
});

const SUCCESSFUL_SEND_RECOVERY = {
  request: {
    query: SEND_RECOVERY,
    variables: {
      email: 'test@test.com',
    },
  },
  result: {
    data: {
      sendRecovery: true,
    },
  },
};

const INVALID_USER = {
  request: {
    query: SEND_RECOVERY,
    variables: {
      email: 'usernotexists@test.com',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Usuário Não Existe.')],
  },
};
