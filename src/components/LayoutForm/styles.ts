import styled from 'styled-components/native';

type HeaderProps = {
  hasOnboardingRoutes?: boolean;
};

export const Header = styled.View<HeaderProps>`
  margin-top: 4%;
  margin-bottom: 2%;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ hasOnboardingRoutes }) =>
    hasOnboardingRoutes ? 'flex-end' : 'space-between'};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.activeText};
  font: 600 24px/32px 'TitilliumWeb-SemiBold';
`;

export const Icon = styled.TouchableOpacity`
  padding: 0 24px 0 12px;
`;

export const ContainerTitle = styled.View`
  flex: 1;
  padding-left: 24px;
`;
export const Image = styled.View`
  height: 32%;
  margin-top: 8%;
`;

export const ContainerTextLink = styled.TouchableOpacity`
  align-items: center;
  padding: 0 16px;
`;

export const TextLink = styled.Text`
  color: ${({ theme }) => theme.color.activeText};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
`;

export const FormContainer = styled.KeyboardAvoidingView`
  height: 364px;
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
  min-height: 500px;
`;
