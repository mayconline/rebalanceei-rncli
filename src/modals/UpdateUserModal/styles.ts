import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.primary};
  elevation: 5;
`;

export const Image = styled.View`
  height: 220px;
`;

export const ContainerTitle = styled.View`
  margin: 40px 0 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BackIcon = styled.TouchableOpacity`
  padding-right: 8px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.activeText};
  font: 600 24px/32px 'TitilliumWeb-SemiBold';

  text-align: center;
  flex: 1;
`;

export const FormContainer = styled.KeyboardAvoidingView`
  flex: 1;
  max-height: 316px;
  elevation: 5;
`;

export const Form = styled.View`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  min-height: 500px;
`;

export const FormRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ContainerButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
`;
