import React, { act } from 'react';
import Welcome from './index';
import { render, fireEvent, waitFor } from '../../../utils/testProvider';
import * as localStorage from '../../../utils/localStorage';

const mockedGetLocalStorage = jest.spyOn(localStorage, 'getLocalStorage');

describe('Welcome Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display correct page view on first access', async () => {
    const { getByText, findByText, navigate } = render(<Welcome />);

    getByText(/Seja Bem Vindo/i);
    getByText(/Rebalanceei/i);

    const button = await findByText(/Entrar/i);

    await act(async () => fireEvent.press(button));

    expect(mockedGetLocalStorage).toHaveBeenCalledWith('@authFirstAccess');

    expect(navigate).toBeCalledWith('StepOne');
  });

  it('should open login modal', async () => {
    mockedGetLocalStorage.mockResolvedValue('true');

    const { getByText, findByA11yLabel, findByA11yRole, navigate } = render(
      <Welcome />,
    );

    getByText(/Seja Bem Vindo/i);
    getByText(/Rebalanceei/i);

    const button = await findByA11yLabel(/Entrar/i);
    await act(async () => fireEvent.press(button));

    expect(mockedGetLocalStorage).toHaveBeenCalledWith('@authFirstAccess');

    expect(navigate).toHaveBeenCalledTimes(0);

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Bem Vindo de Volta']);
  });

  it('should open signup modal', async () => {
    mockedGetLocalStorage.mockResolvedValue('true');

    const { getByText, findByA11yLabel, findByA11yRole } = render(<Welcome />);

    getByText(/Seja Bem Vindo/i);
    getByText(/Rebalanceei/i);

    const button = await findByA11yLabel(/Ainda não possui uma conta/i);
    await act(async () => fireEvent.press(button));

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Criar Conta']);
  });
});
