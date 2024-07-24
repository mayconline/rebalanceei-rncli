import styled from 'styled-components/native';
interface IStepIndicator {
  active?: boolean;
}

export const Icon = styled.TouchableOpacity`
  padding: 0 24px 0 12px;
`;

export const ContainerTitle = styled.View`
  align-items: center;
  margin: 36px 24px;
`;

export const ContainerIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 0 12px;
`;

export const StepIndicator = styled.View<IStepIndicator>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, active }) =>
    active ? theme.color.activeStep : theme.color.inactiveStep};
  margin: 0 4px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.onboardingTitle};
  font: 600 36px/44px 'TitilliumWeb-Bold';
  text-align: center;
  margin: 0 16px 16px;
  font-smooth: 'antialiased';
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.color.onboardingSubtitle};
  font: 400 18px/24px 'TitilliumWeb-Regular';
  text-align: center;
  font-smooth: 'antialiased';
`;

export const Step = styled.View`
  width: 100%;
  align-items: center;
`;
