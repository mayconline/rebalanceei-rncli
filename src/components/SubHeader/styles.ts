import styled from 'styled-components/native';

interface IFocused {
  focused: boolean;
}

export const Wrapper = styled.SafeAreaView`
  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const ContainerTitle = styled.View`
  justify-content: space-between;
  flex-direction: row;
  margin-top: 20px;
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 18px 'TitilliumWeb-Regular';
  font-smooth: antialiased;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 18px 'TitilliumWeb-Regular';
  font-smooth: antialiased;
`;

export const FiltersContainer = styled.View`
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  margin: 12px 0 8px;
`;

export const Filter = styled.TouchableOpacity`
  margin-right: 8px;
`;

export const TextFilter = styled.Text<IFocused>`
  background-color: ${({ focused, theme }) =>
    focused ? theme.color.bgFiltersActive : theme.color.bgFilterInactive};
  color: ${({ focused, theme }) =>
    focused ? theme.color.filterFocused : theme.color.filterDisabled};
  padding: 4px 12px;
  border-radius: 8px;
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  font-smooth: antialiased;
`;
