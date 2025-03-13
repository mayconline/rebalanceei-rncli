import styled, { css } from 'styled-components/native';

interface SelectProps {
  selected?: boolean;
}

interface ITextProps {
  hasDescriptions?: boolean;
}

export const Wrapper = styled.Pressable.attrs({
  android_ripple: { radius: 1, color: '#75BF72' },
})<any>`
  position: relative;
  justify-content: space-between;
  margin: 8px 0;
  height: 114px;
  border-color: ${({ theme, currentPlan, active }) =>
    currentPlan
      ? theme.color.success
      : active
      ? theme.color.blue
      : theme.color.inactiveTabs};
  border-width: 1px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.bgCardPlan};
`;

export const CardPlanHeaderGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  top: 8px;
  right: 8px;
`;

export const CardPlanTitle = styled.Text<ITextProps>`
  color: ${({ theme }) => theme.color.title};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';

  margin-bottom: ${({ hasDescriptions }) => (hasDescriptions ? '12px' : '0px')};
`;

export const CardPlanGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: auto 20px;
`;

export const CardPlanContainerDescription = styled.View`
  flex-direction: column;
`;

export const CardPlanDescription = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  font-smooth: 'antialiased';
`;

export const CardPlanRole = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
  margin-left: -12px;
`;

export const PlanRadioSelect = styled.View<SelectProps>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  border: ${({ selected }) => (selected ? '6px' : '2px')} solid
    ${({ theme }) => theme.color.selectedRadio};
  background-color: ${({ theme }) => theme.color.bgRadio};
`;
