import React, { useContext, useState, useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';

import { Wrapper, ScrollView, ContainerTitle, BackIcon, Title } from './styles';

import Free from './components/Free';
import Premium from './components/Premium';
import { useAuth } from '../../contexts/authContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContainerTitle>
          <Title accessibilityRole="header">Meu Plano Atual</Title>
          <BackIcon
            accessibilityRole="imagebutton"
            accessibilityLabel="Voltar"
            onPress={onClose}
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={color.closeIcon}
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

export default PlanModal;
