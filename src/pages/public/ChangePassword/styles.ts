import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.bgHeaderEmpty};
`;

export const Header = styled.View`
  margin-top: 40px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Icon = styled.TouchableOpacity`
  padding: 0 24px 0 12px;
`;

export const ContainerTitle = styled.View`
  flex: 1;
  padding-left: 36px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.activeText};
  font: 600 24px/32px 'TitilliumWeb-SemiBold';
`;

export const Image = styled.View`
  height: 240px;
`;

export const FormContainer = styled.KeyboardAvoidingView`
  flex: 1;
  max-height: 316px;
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
  align-items: center;
  margin-bottom: 16px;
`;
