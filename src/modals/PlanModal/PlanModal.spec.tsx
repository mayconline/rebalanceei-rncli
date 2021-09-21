import React from 'react';
import PlanModal, { GET_USER_BY_TOKEN } from './index';
import { render, fireEvent, act } from '../../utils/testProvider';
import { Alert } from 'react-native';
import * as CancelPlan from '../../utils/CancelPlan';
import { formatDate } from '../../utils/format';

const mockedOnClose = jest.fn();
const mockedAlert = (Alert.alert = jest.fn());
const mockedLinkCancelPlan = jest.spyOn(CancelPlan, 'getLinkCancelPlan');

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => ({
    plan: {
      transactionDate: 1612968855335,
      renewDate: 1613978855335,
      description: 'Premium Mensal',
      localizedPrice: 'R$ 9,90',
      productId: 'rebalanceei_premium_mensal',
      subscriptionPeriodAndroid: 'P1M',
      packageName: 'com.rebalanceei',
      transactionId: '12121221',
    },
    handleSetLoading: jest.fn(),
  }),
}));

const SUBSCRIPTIONS_MOCK = [
  {
    description: 'Premium Mensal',
    localizedPrice: 'R$ 9,90',
    productId: 'rebalanceei_premium_mensal',
    subscriptionPeriodAndroid: 'P1M',
  },
  {
    description: 'Premium Anual',
    localizedPrice: 'R$ 89,90',
    productId: 'rebalanceei_premium_anual',
    subscriptionPeriodAndroid: 'P1Y',
  },
];

const MOCKED_REQUEST_SUB = jest.fn();

jest.mock('../../services/Iap', () => ({
  listSku: ['rebalanceei_premium_mensal', 'rebalanceei_premium_anual'],
  useIAP: (): Record<string, unknown> => ({
    connected: true,
    subscriptions: SUBSCRIPTIONS_MOCK,
    getSubscriptions: jest.fn(),
    requesSubscription: MOCKED_REQUEST_SUB,
    finishTransaction: jest.fn(),
  }),
}));

describe('PlanModal', () => {
  it('should successfully list current plan and options premium', async () => {
    const {
      findByA11yRole,
      getByText,
      getAllByText,
      getByA11yRole,
      findByText,
    } = render(<PlanModal onClose={mockedOnClose} />, [
      SUCCESSFUL_GET_ROLE_USER,
    ]);

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Meu Plano Atual']);

    await findByText(/Plano Básico - Ativo/i);
    getByText(/Grátis/i);
    getByText(/^\+ Até 2 Carteiras$/i);
    getByText(/^\+ Até 16 Ativos em cada carteira$/i);

    getByText('Torne-se Premium');
    getByText(/^\+ Carteiras ilimitadas$/i);
    getByText(/^\+ Ativos ilimitados$/i);
    getByText(/^\+ Gráficos exclusivos$/i);
    getByText(/^\+ Sem Anúncios$/i);
    getByText(/^\+ Todos os benefícios do app$/i);

    getByText(/Premium Anual/i);
    getByText(/Menos de R\$ 7,50 \/ Mês/i);

    getByText(/Premium Mensal/i);
    getByText(/R\$ 9,90 \/ Mês/i);

    getAllByText(/Gráficos exclusivos/i);
    getAllByText(/Renovação automática/i);

    const submitButton = getByA11yRole('button');
    expect(submitButton).toHaveProperty('children', ['Assine já !']);

    await act(async () => fireEvent.press(submitButton));
    expect(MOCKED_REQUEST_SUB).toHaveBeenCalledTimes(1);
    expect(MOCKED_REQUEST_SUB).toHaveBeenLastCalledWith(
      'rebalanceei_premium_mensal',
    );
  });

  it('should successfully list current plan premium', async () => {
    const {
      findAllByA11yRole,
      findByText,
      getByText,
      getByA11yRole,
    } = render(<PlanModal onClose={mockedOnClose} />, [
      SUCCESSFUL_GET_ROLE_PREMIUM,
    ]);

    const title = await findAllByA11yRole('header');
    expect(title[0]).toHaveProperty('children', ['Meu Plano Atual']);

    await findByText(/Premium Mensal - Ativo/i);
    getByText(/R\$ 9,90 \/ Mês/i);
    getByText(/^Data da Renovação$/i);
    getByText(formatDate(1613978855335));
    getByText(
      /\*Seu Plano será renovado automáticamente na data da renovação./i,
    );

    getByText('Premium');
    getByText(/^\+ Carteiras ilimitadas$/i);
    getByText(/^\+ Ativos ilimitados$/i);
    getByText(/^\+ Gráficos exclusivos$/i);
    getByText(/^\+ Sem Anúncios$/i);
    getByText(/^\+ Todos os benefícios do app$/i);

    const cancelButton = getByA11yRole('button');
    expect(cancelButton).toHaveProperty('children', ['Cancelar Plano']);

    getByText(/\*Seu Plano continuará ativo até o fim do ciclo contratado./i);

    await act(async () => fireEvent.press(cancelButton));

    expect(mockedAlert).toHaveBeenCalledTimes(1);
    expect(mockedAlert.mock.calls[0][0]).toBe('Deseja mesmo cancelar?');
    expect(mockedAlert.mock.calls[0][1]).toMatch(
      /Seu plano continuará ativo até o fim do ciclo contratado/i,
    );

    act(() => mockedAlert.mock.calls[0][2][1].onPress());

    expect(mockedLinkCancelPlan).toHaveBeenCalledTimes(1);
    expect(mockedLinkCancelPlan).toHaveBeenCalledWith(
      'com.rebalanceei',
      'rebalanceei_premium_mensal',
    );
  });
});

const SUCCESSFUL_GET_ROLE_USER = {
  request: {
    query: GET_USER_BY_TOKEN,
  },
  result: {
    data: {
      getUserByToken: {
        _id: 'id_logged',
        role: 'USER',
        __typename: 'User',
      },
    },
  },
};

const SUCCESSFUL_GET_ROLE_PREMIUM = {
  request: {
    query: GET_USER_BY_TOKEN,
  },
  result: {
    data: {
      getUserByToken: {
        _id: 'id_logged',
        role: 'PREMIUM',
        __typename: 'User',
      },
    },
  },
};
