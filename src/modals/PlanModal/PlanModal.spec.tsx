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
    subscriptionOfferDetailsAndroid: [
      {
        pricingPhases: {
          pricingPhaseList: [
            {
              recurrenceMode: 1,
              priceAmountMicros: '287000000',
              billingCycleCount: 0,
              billingPeriod: 'P1Y',
              priceCurrencyCode: 'BRL',
              formattedPrice: 'R$ 287,00',
            },
          ],
        },
        offerTags: [],
        offerToken: 'tokenOfferAnual',
      },
    ],
    nameAndroid: 'Premium Anual',
    productType: 'subs',
    title: 'Premium Anual (Rebalanceei Investimento Ações)',
    id: 'rebalanceei_premium_anual_26',
  },
  {
    subscriptionOfferDetailsAndroid: [
      {
        pricingPhases: {
          pricingPhaseList: [
            {
              recurrenceMode: 1,
              priceAmountMicros: '29900000',
              billingCycleCount: 0,
              billingPeriod: 'P1M',
              priceCurrencyCode: 'BRL',
              formattedPrice: 'R$ 29,90',
            },
          ],
        },
        offerTags: [],
        offerToken: 'tokenOfferMensal',
      },
    ],
    nameAndroid: 'Premium Mensal',
    productType: 'subs',
    title: 'Premium Mensal (Rebalanceei Investimento Ações)',
    id: 'rebalanceei_premium_mensal_26',
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
  listSku: ['rebalanceei_premium_mensal_26', 'rebalanceei_premium_anual_26'],
  useIAP: (): Record<string, unknown> => ({
    connected: true,
    subscriptions: SUBSCRIPTIONS_MOCK.reverse(),
    fetchProducts: jest.fn(),
    finishTransaction: jest.fn(),
  }),
  sendRequestSubscription: jest.fn(),
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

    const { findAllByRole, getByText, getAllByText, getByRole, findByText } =
      render(<PlanModal onClose={mockedOnClose} />);

    const title = await findAllByRole('header');
    expect(title[0]).toHaveProperty('children', ['Meu Plano Atual']);

    await findByText(/Plano Básico - Ativo/i);

    expect(title[1]).toHaveProperty('children', ['Torne-se Premium 👇']);

    getByText(/Quantas carteiras quiser/i);
    getByText(/Quantos ativos quiser/i);
    getByText(/Sem Anúncios/i);
    getByText(/Teste 7 dias grátis/i);

    getByText(/Premium Anual/i);
    getByText(/20% de desconto/i);
    getByText(/R\$ 287,00 \/ Ano/i);

    getByText(/Premium Mensal/i);
    getByText(/R\$ 29,90 \/ Mês/i);

    getAllByText(/Renovação automática/i);

    const submitButton = getByRole('button');
    expect(submitButton).toHaveProperty('children', ['Assine já']);

    await act(async () => fireEvent.press(submitButton));

    expect(sendRequestSubscription).toHaveBeenCalledTimes(1);
    expect(sendRequestSubscription).toHaveBeenLastCalledWith(
      'rebalanceei_premium_mensal_26',
      'tokenOfferMensal'
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
        localizedPrice: 'R$ 29,90',
        productId: 'rebalanceei_premium_mensal_26',
        subscriptionPeriodAndroid: 'P1M',
        packageName: 'com.rebalanceei',
        transactionId: '12121221',
        purchaseToken: 'token',
        platform: 'ANDROID',
        autoRenewing: true,
      },
    });

    const {
      findAllByRole,
      findByText,
      getByText,
      getByRole,
      mockOpenConfirmModal,
    } = render(<PlanModal onClose={mockedOnClose} />);

    const title = await findAllByRole('header');
    expect(title[0]).toHaveProperty('children', ['Meu Plano Atual']);
    expect(title[1]).toHaveProperty('children', ['Premium']);

    await findByText(/Premium Mensal - Ativo/i);
    getByText(/R\$ 29,90 \/ Mês/i);
    getByText(/^Data da Renovação$/i);
    getByText(formatDate({ dateNumber: 1613978855335 }));
    getByText(
      /\*Seu Plano será renovado automáticamente na data da renovação./i
    );

    getByText('Premium');

    getByText(/Quantas carteiras quiser/i);
    getByText(/Quantos ativos quiser/i);
    getByText(/Sem Anúncios/i);
    getByText(/Teste 7 dias grátis/i);

    const cancelButton = getByRole('button');
    expect(cancelButton).toHaveProperty('children', ['Cancelar Plano']);

    getByText(/\*Seu Plano continuará ativo até o fim do ciclo contratado./i);

    await act(async () => fireEvent.press(cancelButton));

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1);
    expect(mockOpenConfirmModal.mock.calls[0][0].description).toBe(
      'Tem certeza que deseja cancelar o plano?'
    );
    expect(mockOpenConfirmModal.mock.calls[0][0].legend).toBe(
      `Seu plano continuará ativo até o fim do ciclo contratado: ${formatDate({
        dateNumber: 1613978855335,
        withTime: false,
      })}`
    );

    await act(async () => {
      mockOpenConfirmModal.mock.calls[0][0].onConfirm();
    });

    expect(mockedLinkCancelPlan).toHaveBeenCalledTimes(1);
    expect(mockedLinkCancelPlan).toHaveBeenCalledWith(
      'com.rebalanceei',
      'rebalanceei_premium_mensal_26'
    );
  });
});
