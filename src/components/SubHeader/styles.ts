import styled from 'styled-components/native';

interface IFocused {
  focused: boolean;
}

export const Wrapper = styled.SafeAreaView`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const ContainerTitle = styled.View`
  justify-content: space-between;
  flex-direction: row;
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
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
  border-radius: 16px;
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
`;
