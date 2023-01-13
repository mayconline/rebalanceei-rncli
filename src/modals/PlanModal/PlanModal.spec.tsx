import React from 'react';
import PlanModal from './index';
import { render, fireEvent, act } from '../../utils/testProvider';
import { Alert } from 'react-native';
import * as CancelPlan from '../../utils/CancelPlan';
import { formatDate } from '../../utils/format';
import { sendRequestSubscription } from '../../services/Iap';

const mockedOnClose = jest.fn();
const mockedAlert = (Alert.alert = jest.fn());
const mockedLinkCancelPlan = jest.spyOn(CancelPlan, 'getLinkCancelPlan');

const SUBSCRIPTIONS_MOCK = [
  {
    subscriptionOfferDetails: [
      {
        pricingPhases: {
          pricingPhaseList: [
            {
              recurrenceMode: 1,
              priceAmountMicros: '189990000',
              billingCycleCount: 0,
              billingPeriod: 'P1Y',
              priceCurrencyCode: 'BRL',
              formattedPrice: 'R$ 189,99',
            },
          ],
        },
        offerTags: [],
        offerToken: 'tokenOfferAnual',
      },
    ],
    name: 'Premium Anual 2023',
    productType: 'subs',
    title: 'Premium Anual 2023 (Rebalanceei Investimento Ações)',
    productId: 'rebalanceei_premium_anual_23',
  },
  {
    subscriptionOfferDetails: [
      {
        pricingPhases: {
          pricingPhaseList: [
            {
              recurrenceMode: 1,
              priceAmountMicros: '19990000',
              billingCycleCount: 0,
              billingPeriod: 'P1M',
              priceCurrencyCode: 'BRL',
              formattedPrice: 'R$ 19,99',
            },
          ],
        },
        offerTags: [],
        offerToken: 'tokenOfferMensal',
      },
    ],
    name: 'Premium Mensal 2023',
    productType: 'subs',
    title: 'Premium Mensal 2023 (Rebalanceei Investimento Ações)',
    productId: 'rebalanceei_premium_mensal_23',
  },
];

const mockedUseAuth = jest.fn();

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => mockedUseAuth(),
}));

jest.mock('../../services/Iap', () => ({
  listSku: ['rebalanceei_premium_mensal_23', 'rebalanceei_premium_anual_23'],
  useIAP: (): Record<string, unknown> => ({
    connected: true,
    subscriptions: SUBSCRIPTIONS_MOCK,
    getSubscriptions: jest.fn(),
    finishTransaction: jest.fn(),
  }),
  sendRequestSubscription: jest.fn(),
  flushFailedPurchasesCachedAsPendingAndroid: jest.fn().mockResolvedValue(true),
  withIAPContext: jest.fn,
}));

describe('PlanModal', () => {
  it('should successfully list current plan and options premium', async () => {
    mockedUseAuth.mockReturnValue({
      plan: null,
      handleSetLoading: jest.fn(),
      showBanner: true,
    });

    const {
      findAllByA11yRole,
      getByText,
      getAllByText,
      getByA11yRole,
      findByText,
    } = render(<PlanModal onClose={mockedOnClose} />);

    const title = await findAllByA11yRole('header');
    expect(title[0]).toHaveProperty('children', ['Meu Plano Atual']);

    await findByText(/Plano Básico - Ativo/i);
    getByText(/Grátis/i);
    getByText(/Carteira e Ativos limitados/i);

    expect(title[1]).toHaveProperty('children', ['Assine Já 👇']);

    getByText(/Menu de Proventos/i);
    getByText(/Gráficos exclusivos/i);
    getByText(/Carteiras ilimitadas/i);
    getByText(/Ativos ilimitados/i);
    getByText(/Sem Anúncios/i);

    getByText(/Premium Anual/i);
    getByText(/Promoção/i);
    getByText(/25% de desconto/i);

    getByText(/Premium Mensal/i);
    getByText(/R\$ 19,99 \/ Mês/i);

    getAllByText(/Gráficos exclusivos/i);
    getAllByText(/Renovação automática/i);

    const submitButton = getByA11yRole('button');
    expect(submitButton).toHaveProperty('children', ['Assine já !']);

    await act(async () => fireEvent.press(submitButton));
    expect(sendRequestSubscription).toHaveBeenCalledTimes(1);
    expect(sendRequestSubscription).toHaveBeenLastCalledWith(
      'rebalanceei_premium_anual_23',
      [
        {
          offerToken: 'tokenOfferAnual',
          sku: 'rebalanceei_premium_anual_23',
        },
      ],
    );
  });

  it('should successfully list current plan premium', async () => {
    mockedUseAuth.mockReturnValue({
      plan: {
        transactionDate: 1612968855335,
        renewDate: 1613978855335,
        description: 'Premium Mensal',
        localizedPrice: 'R$ 19,99',
        productId: 'rebalanceei_premium_mensal_23',
        subscriptionPeriodAndroid: 'P1M',
        packageName: 'com.rebalanceei',
        transactionId: '12121221',
      },
      handleSetLoading: jest.fn(),
      showBanner: false,
    });

    const { findAllByA11yRole, findByText, getByText, getByA11yRole } = render(
      <PlanModal onClose={mockedOnClose} />,
    );

    const title = await findAllByA11yRole('header');
    expect(title[0]).toHaveProperty('children', ['Meu Plano Atual']);

    await findByText(/Premium Mensal - Ativo/i);
    getByText(/R\$ 19,99 \/ Mês/i);
    getByText(/^Data da Renovação$/i);
    getByText(formatDate(1613978855335));
    getByText(
      /\*Seu Plano será renovado automáticamente na data da renovação./i,
    );

    getByText('Premium');
    getByText(/Menu de Proventos/i);
    getByText(/Gráficos exclusivos/i);
    getByText(/Carteiras ilimitadas/i);
    getByText(/Ativos ilimitados/i);
    getByText(/Sem Anúncios/i);

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
      'rebalanceei_premium_mensal_23',
    );
  });
});
