import React from 'react';
import StepOne from './StepOne';
import { render, fireEvent, act } from '../../../utils/testProvider';
import * as localStorage from '../../../utils/localStorage';

const mockedSetLocalStorage = jest.spyOn(localStorage, 'setLocalStorage');

describe('Onboarding StepOne', () => {
  it('should display correct page view', async () => {
    const { getByText, findByText, navigate } = render(<StepOne />);

    const skipButton = await findByText(/Pular/i);

    await act(async () => fireEvent.press(skipButton));

    expect(mockedSetLocalStorage).toHaveBeenCalledWith(
      '@authFirstAccess',
      'true',
    );

    expect(navigate).toBeCalledWith('Welcome');

    getByText(/Bem vindo ao Rebalanceei/i);
    getByText(/Rebalanceeie seus ativos em sua carteira!/i);
    getByText(/É simples e fácil!/i);

    const nextButton = await findByText(/Próximo/i);

    await act(async () => fireEvent.press(nextButton));
    expect(navigate).toBeCalledWith('StepTwo');
  });
});
