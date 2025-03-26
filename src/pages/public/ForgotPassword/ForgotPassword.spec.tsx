import React from 'react';
import ForgotPassword, { SEND_RECOVERY } from './index';
import { render, fireEvent, waitFor, act } from '../../../utils/testProvider';
import { GraphQLError } from 'graphql';

jest.mock('../../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSetLoading: jest.fn(),
  }),
}));

const mockedHandleOpenModal = jest.fn();

describe('ForgotPassword Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully send recovery', async () => {
    const {
      getByText,
      getAllByText,
      getByPlaceholderText,
      getByDisplayValue,
      getByRole,
      findByRole,
      mockOpenConfirmModal,
    } = render(
      <ForgotPassword
        handleOpenModal={mockedHandleOpenModal}
        onClose={jest.fn()}
      />,
      [INVALID_USER, SUCCESSFUL_SEND_RECOVERY],
    );

    const title = await findByRole('header');
    expect(title).toHaveProperty('children', ['Recuperar Senha']);

    const submitButton = getByRole('button');
    expect(submitButton).toHaveProperty('children', ['Recuperar Senha']);

    await act(async () => fireEvent.press(submitButton));

    getByText(/E-mail/i);
    const inputEmail = getByPlaceholderText(/meuemail@teste.com.br/i);
    await act(async () =>
      fireEvent.changeText(inputEmail, 'usernotexists@test.com'),
    );
    getByDisplayValue('usernotexists@test.com');

    await act(async () => fireEvent.press(submitButton));
    await waitFor(() => getByText(/Usuário Não Existe./i));

    await act(async () => fireEvent.changeText(inputEmail, 'test@test.com'));
    getByDisplayValue('test@test.com');

    const sendButton = getAllByText('Recuperar Senha')[1];
    await act(async () => fireEvent.press(sendButton));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Verifique seu e-mail',
    );
    expect(mockOpenConfirmModal.mock.calls[0][0].legend).toBe(
      'Um código de redefinição de senha foi enviado para seu e-mail.',
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    expect(mockedHandleOpenModal).toHaveBeenCalledTimes(1);
    expect(mockedHandleOpenModal).toHaveBeenCalledWith('ChangePassword', {
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
