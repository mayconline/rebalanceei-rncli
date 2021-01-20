import React from 'react';
import MenuModal from './index';
import { render, fireEvent, waitFor, act } from '../../utils/testProvider';
import * as Terms from '../../utils/Terms';

const mockedTerms = jest.spyOn(Terms, 'getTerms');
const mockedOnClose = jest.fn();
const mockedhandleSignOut = jest.fn();

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSignOut: mockedhandleSignOut,
  }),
}));

describe('Menu Modal', () => {
  it('should display menu items', async () => {
    const {
      findByText,
      getByText,
      findByA11yRole,
      getByA11yRole,
      getAllByA11yRole,
    } = render(<MenuModal onClose={mockedOnClose} />);

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Menu']);

    getByA11yRole('menu');

    const menuItems = getAllByA11yRole('menuitem');
    expect(menuItems).toHaveLength(6);

    const myData = getByText(/Meus Dados/i);
    act(() => fireEvent.press(myData));
    await findByText('Alterar Usuário');

    const myPlan = getByText(/Meu Plano Atual/i);
    act(() => fireEvent.press(myPlan));
    await findByText('Meu Plano Atual');

    const terms = getByText(/Termos de Uso/i);
    act(() => fireEvent.press(terms));
    expect(mockedTerms).toHaveBeenCalledTimes(1);

    const help = getByText(/Ajuda/i);
    act(() => fireEvent.press(help));
    await findByText('Precisa de Ajuda?');

    getByText(/Versão do APP/i);

    const signOut = getByText(/Sair/i);
    act(() => fireEvent.press(signOut));
    expect(mockedhandleSignOut).toHaveBeenCalledTimes(1);

    const iconBackButton = getAllByA11yRole('imagebutton')[0];
    act(() => fireEvent.press(iconBackButton));
    await waitFor(() => expect(mockedOnClose).toHaveBeenCalledTimes(1));
  });
});
