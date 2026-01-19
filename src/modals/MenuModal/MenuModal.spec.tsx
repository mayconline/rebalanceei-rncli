import React from 'react';
import MenuModal from './index';
import { render, fireEvent, waitFor, act } from '../../utils/testProvider';
import * as Terms from '../../utils/Terms';
import { GET_QUESTIONS } from '../HelpModal';
import { GET_USER_BY_TOKEN } from '../../graphql/queries';

const mockedTerms = jest.spyOn(Terms, 'getTerms');
const mockedOnClose = jest.fn();
const mockedhandleSignOut = jest.fn();
const mockedSetSelectTheme = jest.fn();
const mockedHandleShareXLS = jest.fn();

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    handleSignOut: mockedhandleSignOut,
    handleSetLoading: jest.fn(),
    setSelectTheme: mockedSetSelectTheme,
  }),
}));

jest.mock('../../hooks/useXLS', () => ({
  useXLS: () => ({
    handleShareXLS: mockedHandleShareXLS,
  }),
}));

describe('Menu Modal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display menu items', async () => {
    const { getByText, findByRole, getAllByRole } = render(
      <MenuModal onClose={mockedOnClose} />
    );

    const title = await findByRole('header');
    expect(title).toHaveProperty('children', ['Menu']);

    const menuItems = getAllByRole('menuitem');
    expect(menuItems).toHaveLength(8);

    getByText(/Minha Conta/i);

    getByText(/Meu Plano Atual/i);

    getByText(/Exportar Carteira/i);

    getByText(/Modo Escuro/i);

    getByText(/Termos de Uso/i);

    getByText(/Ajuda/i);

    getByText(/Versão do APP/i);

    getByText(/Sair/i);

    const iconBackButton = getAllByRole('imagebutton')[0];
    await act(async () => fireEvent.press(iconBackButton));
    await waitFor(() => expect(mockedOnClose).toHaveBeenCalledTimes(1));
  });

  it('should open my account modal', async () => {
    const { getByText } = render(<MenuModal onClose={mockedOnClose} />, [
      SUCCESSFUL_GET_USER_BY_TOKEN,
    ]);

    const myAccount = getByText(/Minha Conta/i);
    await act(async () => fireEvent.press(myAccount));

    getByText(/Desativar Conta/i);
  });

  it('should open my plan modal', async () => {
    const { getByText } = render(<MenuModal onClose={mockedOnClose} />);

    const myCurrentPlan = getByText(/Meu Plano Atual/i);
    await act(async () => fireEvent.press(myCurrentPlan));
  });

  it('should toggle dark mode', async () => {
    const { getByText } = render(<MenuModal onClose={mockedOnClose} />);

    const darkMode = getByText(/Modo Escuro/i);
    await act(async () => fireEvent.press(darkMode));

    expect(mockedSetSelectTheme).toHaveBeenCalledTimes(1);
    expect(mockedSetSelectTheme).toHaveBeenCalledWith('DARK');
  });

  it('should open terms modal', async () => {
    const { getByText } = render(<MenuModal onClose={mockedOnClose} />);

    const terms = getByText(/Termos de Uso/i);
    await act(async () => fireEvent.press(terms));

    expect(mockedTerms).toHaveBeenCalledTimes(1);
  });

  it('should open help modal', async () => {
    const { getByText, findAllByRole } = render(
      <MenuModal onClose={mockedOnClose} />,
      [SUCCESSFUL_LIST_QUESTIONS]
    );

    const help = getByText(/Ajuda/i);
    await act(async () => fireEvent.press(help));

    const title = await findAllByRole('header');
    expect(title[1]).toHaveProperty('children', ['Ajuda']);
    expect(title[2]).toHaveProperty('children', [
      'Como faço para adicionar um ativo ?',
    ]);
  });

  it('should sign out', async () => {
    const { getByText } = render(<MenuModal onClose={mockedOnClose} />);

    const signOut = getByText(/Sair/i);
    await act(async () => fireEvent.press(signOut));

    expect(mockedhandleSignOut).toHaveBeenCalledTimes(1);
  });

  it('should export wallet to xls', async () => {
    const { getByText } = render(<MenuModal onClose={mockedOnClose} />);

    const exportWallet = getByText(/Exportar Carteira/i);
    await act(async () => fireEvent.press(exportWallet));

    expect(mockedHandleShareXLS).toHaveBeenCalledTimes(1);
  });
});

const SUCCESSFUL_LIST_QUESTIONS = {
  request: {
    query: GET_QUESTIONS,
  },
  result: {
    data: {
      questions: [
        {
          _id: '5fe10802361e4f25c446c5f2',
          ask: 'Como faço para adicionar um ativo ?',
          answer:
            'Clicando no botão azul de (+) no meio das abas, abrirá uma aba para que seja cadastrado os ativos, é preciso clicar em pesquisar ativo, e procurar pelo codigo dele, e após clicar em adicionar, e continuar preenchendo as informações de Nota, Quantidade e Preço Médio.',
        },
        {
          _id: '5fe108403edb9f3ce0f19e56',
          ask: 'Como adicionar um ativo internacional ?',
          answer:
            'Da mesma forma que um ativo nacional, porém convertendo o valor em Dolar para Reais antes de adicionar o ativo na aba Ativos.',
        },
      ],
    },
  },
};

const SUCCESSFUL_GET_USER_BY_TOKEN = {
  request: {
    query: GET_USER_BY_TOKEN,
  },
  result: {
    data: {
      getUserByToken: {
        _id: '5fa1d103a8c5892a48c69b31',
        email: 'exemple@test.com',
        role: 'USER',
        checkTerms: true,
        active: true,
        __typename: 'User',
      },
    },
  },
};
