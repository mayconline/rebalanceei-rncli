import styled from 'styled-components/native';
interface IStepIndicator {
  active?: boolean;
}

export const Icon = styled.TouchableOpacity`
  padding: 0 24px 0 12px;
`;

export const ContainerTitle = styled.View`
  align-items: center;
  margin-bottom: 36px;
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
    active ? theme.color.blue : theme.color.blueLight};
  margin: 0 4px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 36px/44px 'TitilliumWeb-SemiBold';
  text-align: center;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  text-align: center;
`;

export const StepContainer = styled.View`
  flex: 1;
  max-height: 316px;
`;

export const Step = styled.View`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  min-height: 500px;
  width: 100%;
`;
