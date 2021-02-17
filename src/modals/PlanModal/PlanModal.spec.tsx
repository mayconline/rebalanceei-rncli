import React from 'react';
import PlanModal, { GET_USER_BY_TOKEN } from './index';
import { render, fireEvent, act } from '../../utils/testProvider';
import * as RNIap from 'react-native-iap';
import { Platform, Alert } from 'react-native';
import * as CancelPlan from '../../utils/CancelPlan';

const purchaseListener = jest.spyOn(RNIap, 'purchaseUpdatedListener');
purchaseListener.mockImplementationOnce(jest.fn());

const purchaseErrorListener = jest.spyOn(RNIap, 'purchaseErrorListener');
purchaseErrorListener.mockImplementationOnce(jest.fn());

const endConnection = jest.spyOn(RNIap, 'endConnection');
endConnection.mockImplementationOnce(jest.fn());

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
  }),
}));

describe('PlanModal', () => {
  it('should successfully list current plan and options premium', async () => {
    const { findByA11yRole, findByText } = render(
      <PlanModal onClose={mockedOnClose} />,
      [SUCCESSFUL_GET_ROLE_USER],
    );

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Meu Plano Atual']);
  });

  it('should successfully list current plan premium', async () => {
    Platform.OS = 'android';

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
    getByText(/22\/02\/2021 às 04:27:35/i);
    getByText(
      /\*Seu Plano será renovado automáticamente na data da renovação./i,
    );

    expect(title[1]).toHaveProperty('children', ['Premium']);
    getByText(/^\+ Carteiras ilimitadas$/i);
    getByText(/^\+ Ativos ilimitados$/i);
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
