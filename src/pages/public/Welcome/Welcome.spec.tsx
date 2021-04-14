import React from 'react';
import Welcome from './index';
import { render, fireEvent, waitFor } from '../../../utils/testProvider';
import * as localStorage from '../../../utils/localStorage';

const mockedGetLocalStorage = jest.spyOn(localStorage, 'getLocalStorage');

jest.mock('../../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSetLoading: jest.fn(),
  }),
}));

describe('Welcome Page', () => {
  it('should display correct page view on first access', async () => {
    const { getByText, findByText, navigate } = render(<Welcome />);

    getByText(/Seja Bem Vindo/i);
    getByText(/Rebalanceei/i);

    const button = await findByText(/Entrar/i);

    fireEvent.press(button);

    await waitFor(() => {
      expect(mockedGetLocalStorage).toHaveBeenCalledWith('@authFirstAccess');
    });

    expect(navigate).toBeCalledWith('StepOne');
  });

  it('should display correct page view on not first access', async () => {
    mockedGetLocalStorage.mockResolvedValue('true');

    const { getByText, findByText, navigate } = render(<Welcome />);

    getByText(/Seja Bem Vindo/i);
    getByText(/Rebalanceei/i);

    const button = await findByText(/Entrar/i);

    fireEvent.press(button);

    await waitFor(() => {
      expect(mockedGetLocalStorage).toHaveBeenCalledWith('@authFirstAccess');
    });

    expect(navigate).toBeCalledWith('Login');
  });
});
