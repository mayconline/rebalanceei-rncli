import React from 'react';
import StepThree from './StepThree';
import { render, fireEvent, act } from '../../../utils/testProvider';
import * as localStorage from '../../../utils/localStorage';

const mockedSetLocalStorage = jest.spyOn(localStorage, 'setLocalStorage');

describe('Onboarding StepThree', () => {
  it('should display correct page view', async () => {
    const { getByText, findByText, navigate } = render(<StepThree />);

    const skipButton = await findByText(/Pular/i);
    await act(async () => fireEvent.press(skipButton));

    expect(mockedSetLocalStorage).toHaveBeenCalledWith(
      '@authFirstAccess',
      'true',
    );

    expect(navigate).toBeCalledWith('Welcome');

    getByText(/Acompanhe de perto sua carteira/i);
    getByText(
      /Veja a variação de seus ativos e rebalanceeie eles como desejar!/i,
    );

    const nextButton = await findByText(/Vamos Começar/i);
    await act(async () => fireEvent.press(nextButton));

    expect(navigate).toBeCalledWith('Welcome');
  });
});
