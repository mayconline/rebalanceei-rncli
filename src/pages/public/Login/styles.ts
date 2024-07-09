import styled from 'styled-components/native';

export const FormRow = styled.SafeAreaView`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
