import styled from 'styled-components/native';

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 18px/32px 'TitilliumWeb-Regular';
  text-align: center;
  flex: 1;
  font-smooth: 'antialiased';
`;

export const FormContainer = styled.KeyboardAvoidingView`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  elevation: 5;
`;

export const Form = styled.View`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
`;
