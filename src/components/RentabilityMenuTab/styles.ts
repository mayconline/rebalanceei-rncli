import styled from 'styled-components/native';

interface IFocused {
  focused: boolean;
}

export const MenuWrapper = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

export const MenuButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

export const MenuButtonText = styled.Text<IFocused>`
  background-color: ${({ focused, theme }) =>
    focused ? theme.color.bgFiltersActive : theme.color.bgFilterInactive};
  color: ${({ focused, theme }) =>
    focused ? theme.color.filterFocused : theme.color.filterDisabled};
  padding: 8px 16px;
  border-radius: 8px;
  font: 600 18px 'TitilliumWeb-SemiBold';
  font-smooth: antialiased;
`;
