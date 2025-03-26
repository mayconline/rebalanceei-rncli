import React from 'react';
import ChangePassword, { RESET_PASSWORD } from './index';
import { render, fireEvent, waitFor, act } from '../../../utils/testProvider';
import { GraphQLError } from 'graphql';

jest.mock('../../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSetLoading: jest.fn(),
  }),
}));

describe('ChangePassword Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully reset password', async () => {
    const {
      getByText,
      getAllByText,
      getByPlaceholderText,
      getByDisplayValue,
      getByRole,
      findByRole,
      debug,
    } = render(
      <ChangePassword modalData={MOCKED_PARAMS} onClose={jest.fn()} />,
      [INVALID_CREDENTIALS, SUCCESSFUL_RESET_PASSWORD],
      MOCKED_PARAMS,
    );

    const title = await findByRole('header');
    expect(title).toHaveProperty('children', ['Nova Senha']);

    const submitButton = getByRole('button');
    expect(submitButton).toHaveProperty('children', ['Alterar Senha']);

    fireEvent.press(submitButton);

    getByText(/^Code$/i);
    const inputCode = getByPlaceholderText('999999');
    fireEvent.changeText(inputCode, '000000');
    getByDisplayValue('000000');

    getAllByText(/^Nova Senha$/i)[1];
    const inputPassword = getByPlaceholderText('********');
    fireEvent.changeText(inputPassword, '123');
    getByDisplayValue('123');

    fireEvent.press(submitButton);
    await waitFor(() => getByText(/Code Inválido ou Expirado./i));

    fireEvent.changeText(inputCode, '674E3D');
    getByDisplayValue('674E3D');

    const resetButton = getByText('Alterar Senha');
    await act(async () => fireEvent.press(resetButton));
  });
});

const SUCCESSFUL_RESET_PASSWORD = {
  request: {
    query: RESET_PASSWORD,
    variables: {
      email: 'test@test.com',
      code: '674E3D',
      password: '123',
    },
  },
  result: {
    data: {
      resetPassword: true,
    },
  },
};

const INVALID_CREDENTIALS = {
  request: {
    query: RESET_PASSWORD,
    variables: {
      email: 'test@test.com',
      code: '000000',
      password: '123',
    },
  },
  result: {
    data: undefined,
    errors: [new GraphQLError('Code Inválido ou Expirado.')],
  },
};

const MOCKED_PARAMS = {
  email: 'test@test.com',
};
