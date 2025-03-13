import styled from 'styled-components/native';

export const FormRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  width: 100%;
`;

export const SuggestButton = styled.TouchableOpacity`
  align-items: center;
  padding: 8px 0px;
  border-bottom-color: ${({ theme }) => theme.color.divider};
  border-bottom-width: 1px;
  border-radius: 4px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const SuggestButtonText = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 400 14px 'TitilliumWeb-Regular';
  flex: 1;
  font-smooth: 'antialiased';
  margin-left: 8px;
`;

export const ContainerButtons = styled.View`
  margin: 12% 16%;
`;
