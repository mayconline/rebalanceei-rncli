import React from 'react';
import PlanModal from './index';
import { render, fireEvent, act } from '../../utils/testProvider';
import * as CancelPlan from '../../utils/CancelPlan';
import { formatDate } from '../../utils/format';
import { sendRequestSubscription } from '../../services/Iap';

const mockedOnClose = jest.fn();
const mockedLinkCancelPlan = jest.spyOn(CancelPlan, 'getLinkCancelPlan');

const SUBSCRIPTIONS_MOCK = [
  {
    subscriptionOfferDetails: [
      {
        pricingPhases: {
          pricingPhaseList: [
            {
              recurrenceMode: 1,
              priceAmountMicros: '335640000',
              billingCycleCount: 0,
              billingPeriod: 'P1Y',
              priceCurrencyCode: 'BRL',
              formattedPrice: 'R$ 335,64',
            },
          ],
        },
        offerTags: [],
        offerToken: 'tokenOfferAnual',
      },
    ],
    name: 'Premium Anual 2024',
    productType: 'subs',
    title: 'Premium Anual 2024 (Rebalanceei Investimento Ações)',
    productId: 'rebalanceei_premium_anual_2024',
  },
  {
    subscriptionOfferDetails: [
      {
        pricingPhases: {
          pricingPhaseList: [
            {
              recurrenceMode: 1,
              priceAmountMicros: '37970000',
              billingCycleCount: 0,
              billingPeriod: 'P1M',
              priceCurrencyCode: 'BRL',
              formattedPrice: 'R$ 37,97',
            },
          ],
        },
        offerTags: [],
        offerToken: 'tokenOfferMensal',
      },
    ],
    name: 'Premium Mensal 2024',
    productType: 'subs',
    title: 'Premium Mensal 2024 (Rebalanceei Investimento Ações)',
    productId: 'rebalanceei_premium_mensal_24',
  },
];

const mockedUseAuth = jest.fn();
const mockedUseRoleUser = jest.fn();

jest.mock('../../contexts/authContext', () => ({
  useAuth: () => mockedUseAuth(),
}));

jest.mock('../../hooks/useRoleUser', () => {
  return jest.fn(() => mockedUseRoleUser());
});

jest.mock('../../services/Iap', () => ({
  listSku: ['rebalanceei_premium_mensal_24', 'rebalanceei_premium_anual_2024'],
  useIAP: (): Record<string, unknown> => ({
    connected: true,
    subscriptions: SUBSCRIPTIONS_MOCK.reverse(),
    getSubscriptions: jest.fn(),
    finishTransaction: jest.fn(),
  }),
  sendRequestSubscription: jest.fn(),
  flushFailedPurchasesCachedAsPendingAndroid: jest.fn().mockResolvedValue(true),
  withIAPContext: jest.fn,
}));

describe('PlanModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully list current plan and options premium', async () => {
    mockedUseAuth.mockReturnValue({
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

    expect(title[1]).toHaveProperty('children', ['Torne-se Premium 👇']);

    getByText(/Menu de Proventos/i);
    getByText(/Gráficos exclusivos/i);
    getByText(/Carteiras ilimitadas/i);
    getByText(/Ativos ilimitados/i);
    getByText(/Sem Anúncios/i);

    getByText(/Premium Anual/i);
    getByText(/R\$ 120,00 OFF Anual/i);
    getByText(/R\$ 335,64 \/ Ano/i);

    getByText(/Premium Mensal/i);
    getByText(/R\$ 37,97 \/ Mês/i);

    getAllByText(/Renovação automática/i);

    const submitButton = getByA11yRole('button');
    expect(submitButton).toHaveProperty('children', ['Assine já']);

    await act(async () => fireEvent.press(submitButton));

    expect(sendRequestSubscription).toHaveBeenCalledTimes(1);
    expect(sendRequestSubscription).toHaveBeenLastCalledWith(
      'rebalanceei_premium_mensal_24',
      [
        {
          offerToken: 'tokenOfferMensal',
          sku: 'rebalanceei_premium_mensal_24',
        },
      ],
    );
  });

  it('should successfully list current plan premium', async () => {
    mockedUseAuth.mockReturnValue({
      handleSetLoading: jest.fn(),
      showBanner: false,
    });

    mockedUseRoleUser.mockReturnValue({
      plan: {
        transactionDate: 1612968855335,
        renewDate: 1613978855335,
        description: 'Premium Mensal',
        localizedPrice: 'R$ 37,97',
        productId: 'rebalanceei_premium_mensal_24',
        subscriptionPeriodAndroid: 'P1M',
        packageName: 'com.rebalanceei',
        transactionId: '12121221',
      },
    });

    const {
      findAllByA11yRole,
      findByText,
      getByText,
      getByA11yRole,
      mockOpenConfirmModal,
    } = render(<PlanModal onClose={mockedOnClose} />);

    const title = await findAllByA11yRole('header');
    expect(title[0]).toHaveProperty('children', ['Meu Plano Atual']);
    expect(title[1]).toHaveProperty('children', ['Premium']);

    await findByText(/Premium Mensal - Ativo/i);
    getByText(/R\$ 37,97 \/ Mês/i);
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

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja cancelar o plano?',
    );
    expect(mockOpenConfirmModal.mock.calls[0][0].legend).toBe(
      'Seu plano continuará ativo até o fim do ciclo contratado: 22/02/2021',
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    expect(mockedLinkCancelPlan).toHaveBeenCalledTimes(1);
    expect(mockedLinkCancelPlan).toHaveBeenCalledWith(
      'com.rebalanceei',
      'rebalanceei_premium_mensal_24',
    );
  });
});
