import styled from 'styled-components/native';

interface IWrapper {
  currentPlan: boolean;
  active?: boolean;
}

export const Wrapper = styled.TouchableOpacity<IWrapper>`
  margin: 8px 0;
  border-color: ${({ theme, currentPlan, active }) =>
    currentPlan
      ? theme.color.success
      : active
      ? theme.color.success
      : theme.color.titleNotImport};
  border-width: 2px;
  border-radius: 12px;
`;

export const CardPlanTitle = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  margin: 12px 24px 0;
`;

export const CardPlanGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 8px;
  margin: 8px;
`;

export const CardPlanContainerDescription = styled.View``;

export const CardPlanDescription = styled.Text`
  color: ${({ theme }) => theme.color.subtitle};
  font: 400 16px/24px 'TitilliumWeb-Regular';
`;

export const CardPlanRole = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  margin-top: -32px;
`;
