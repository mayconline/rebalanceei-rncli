import React from 'react';
import StepTwo from './StepTwo';
import { render, fireEvent, waitFor } from '../../../utils/testProvider';
import * as localStorage from '../../../utils/localStorage';

const mockedSetLocalStorage = jest.spyOn(localStorage, 'setLocalStorage');

describe('Onboarding StepTwo', () => {
  it('should display correct page view', async () => {
    const { getByText, findByText, navigate } = render(<StepTwo />);

    const skipButton = await findByText(/Pular/i);

    fireEvent.press(skipButton);

    await waitFor(() =>
      expect(mockedSetLocalStorage).toHaveBeenCalledWith(
        '@authFirstAccess',
        'true',
      ),
    );

    expect(navigate).toBeCalledWith('SignUp');

    getByText(/Adicione seus ativos e dê notas a eles/i);
    getByText(
      /Usamos elas para verificar a % ideal de cada ativo baseado em suas preferências!/i,
    );

    const nextButton = await findByText(/Próximo/i);

    fireEvent.press(nextButton);
    expect(navigate).toBeCalledWith('StepThree');
  });
});
