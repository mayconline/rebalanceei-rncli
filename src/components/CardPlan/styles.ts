import styled from 'styled-components/native';

interface SelectProps {
  selected?: boolean;
}

export const Wrapper = styled.Pressable.attrs({
  android_ripple: { radius: 1, color: '#75BF72' },
})<any>`
  margin: 8px 0 16px;
  border-color: ${({ theme, currentPlan, active }) =>
    currentPlan
      ? theme.color.success
      : active
      ? theme.color.blue
      : theme.color.inactiveTabs};
  border-width: 2px;
  border-radius: 12px;
  elevation: ${({ active }) => (active ? 2 : 0)};
  background-color: ${({ theme }) => theme.color.bgCardPlan};
`;

export const CardPlanHeaderGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 8px 0px;
`;

export const CardPlanTitle = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  margin: 12px 16px 0;
`;

export const CardPlanGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 8px 12px;
  margin: 12px;
`;

export const CardPlanContainerDescription = styled.View`
  gap: 8px;
`;

export const CardPlanDescription = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px/24px 'TitilliumWeb-Regular';
`;

export const CardPlanRole = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  margin-top: -10px;
`;

export const PlanRadioSelect = styled.View<SelectProps>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  border: ${({ selected }) => (selected ? '8px' : '4px')} solid
    ${({ selected, theme }) =>
      selected ? theme.color.blue : theme.color.inactiveTabs};
`;
