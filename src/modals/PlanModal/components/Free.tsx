import React, { useCallback, useContext } from 'react'
import { ActivityIndicator } from 'react-native'
import { ThemeContext } from 'styled-components/native'
import CopyPremmium from '../../../components/CopyPremmium'
import CardPlan from '../../../components/CardPlan'
import Button from '../../../components/Button'
import { ContainerButtons } from '../styles'
import type { IPlanName } from '../index'
import TextError from '../../../components/TextError'
import type { Subscription } from '../../../services/Iap'
import usePurchase from '../../../hooks/usePurchase'

interface IFree {
  mutationLoading?: boolean
  planName: IPlanName
  handleSelectPlan(plan: IPlanName): void
}

const Free = ({ planName, handleSelectPlan }: IFree) => {
  const { color } = useContext(ThemeContext)

  const {
    listSubscriptions,
    purchaseStatus,
    errorMessage,
    validatePurchaseLoading,
    validatePurchaseError,
    updateRoleLoading,
    updateRoleError,
    selectedSku,
    handlePurchaseSubscription,
    setErrorMessage,
    setSelectedSku,
  } = usePurchase()

  const handleChangeOptionPlan = useCallback(
    async (sku: Subscription, duration: any) => {
      if (!sku || !duration) {
        return
      }

      setSelectedSku(sku)
      handleSelectPlan(duration)
      setErrorMessage(undefined)
    },
    [handleSelectPlan, setErrorMessage, setSelectedSku]
  )

  const hasPurchaseLoading = ['LOADING_LIST', 'PROCESSING_PAYMENT'].includes(
    purchaseStatus
  )

  return hasPurchaseLoading ? (
    <ActivityIndicator size="large" color={color.filterDisabled} />
  ) : (
    <>
      <CardPlan
        title="✅ Plano Básico - Ativo"
        descriptions={['📂 Até 1 Carteira', '🛒 Até 16 ativos']}
        plan="Grátis"
        currentPlan
        disabled
      />
      {!!listSubscriptions?.length && <CopyPremmium />}

      {listSubscriptions?.length ? (
        listSubscriptions?.map(subscription => {
          const subsDetails =
            subscription?.subscriptionOfferDetailsAndroid?.[0]?.pricingPhases
              ?.pricingPhaseList?.[0]

          const subscriptionPeriodAndroid = subsDetails?.billingPeriod
          const localizedPrice = subsDetails?.formattedPrice

          return (
            <CardPlan
              key={subscription.id}
              title={subscription.title}
              descriptions={
                subscriptionPeriodAndroid === 'P1M'
                  ? []
                  : ['🔖 Promoção limitada', '💰 R$ 120,00 OFF Anual']
              }
              plan={`${localizedPrice} / ${
                subscriptionPeriodAndroid === 'P1M' ? 'Mês' : 'Ano'
              }`}
              active={planName === subscriptionPeriodAndroid}
              onPressIn={() =>
                handleChangeOptionPlan(subscription, subscriptionPeriodAndroid)
              }
            />
          )
        })
      ) : (
        <ActivityIndicator size="large" color={color.filterDisabled} />
      )}

      <ContainerButtons>
        <Button
          onPress={() => handlePurchaseSubscription(selectedSku)}
          loading={
            updateRoleLoading || validatePurchaseLoading || hasPurchaseLoading
          }
          disabled={
            updateRoleLoading || validatePurchaseLoading || hasPurchaseLoading
          }
        >
          Assine já
        </Button>
      </ContainerButtons>

      {!!updateRoleError && <TextError>{updateRoleError?.message}</TextError>}
      {!!errorMessage && <TextError>{errorMessage}</TextError>}
      {!!validatePurchaseError && (
        <TextError>{validatePurchaseError?.message}</TextError>
      )}
    </>
  )
}

export default Free
