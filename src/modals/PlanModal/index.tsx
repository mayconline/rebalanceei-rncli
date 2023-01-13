import React, { useContext, useState, useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';

import { Wrapper, ScrollView, ContainerTitle, BackIcon, Title } from './styles';

import AntDesign from 'react-native-vector-icons/AntDesign';

import Free from './components/Free';
import Premium from './components/Premium';
import { useAuth } from '../../contexts/authContext';
import { withIAPContext } from '../../services/Iap';

interface PlanModal {
  onClose(): void;
}

export type IPlanName = 'FREE' | 'P1Y' | 'P1M' | null;

const PlanModal = ({ onClose }: PlanModal) => {
  const { showBanner } = useAuth();

  const { color } = useContext(ThemeContext);
  const [planName, setPlanName] = useState<IPlanName>(null);

  useFocusEffect(
    useCallback(() => {
      showBanner ? handleSelectPlan('P1Y') : handleSelectPlan('FREE');
    }, [showBanner]),
  );

  const handleSelectPlan = useCallback((plan: IPlanName) => {
    setPlanName(plan);
  }, []);

  return (
    <Wrapper>
      <ScrollView>
        <ContainerTitle>
          <Title accessibilityRole="header">Meu Plano Atual</Title>
          <BackIcon
            accessibilityRole="imagebutton"
            accessibilityLabel="Voltar"
            onPress={onClose}
          >
            <AntDesign
              name="closecircleo"
              size={24}
              color={color.shadowBackdrop}
            />
          </BackIcon>
        </ContainerTitle>
        {showBanner ? (
          <Free planName={planName} handleSelectPlan={handleSelectPlan} />
        ) : (
          <Premium />
        )}
      </ScrollView>
    </Wrapper>
  );
};

export default withIAPContext(PlanModal);
