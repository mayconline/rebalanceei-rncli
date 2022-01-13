import styled from 'styled-components/native';

export const FormRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ContainerTextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

export const TextLink = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 400 16px/24px 'TitilliumWeb-Regular';
`;

export const ContainerForgotPassword = styled.TouchableOpacity`
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 24px;
`;

export const TextForgotPassword = styled.Text`
  color: ${({ theme }) => theme.color.blue};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  text-align: right;
`;
