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
  color: ${({ theme }) => theme.color.title};
  font: 600 18px/32px 'TitilliumWeb-Regular';
`;

export const Image = styled.View`
  height: 32%;
  margin-top: 8%;
  justify-content: center;
  align-items: center;
`;

export const ContainerTextLink = styled.TouchableOpacity`
  align-items: center;
  padding: 0 32px;
`;

export const TextLink = styled.Text`
  color: ${({ theme }) => theme.color.onboardingSubtitle};
  font: 600 18px/24px 'TitilliumWeb-SemiBold';
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
  min-height: 300px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;
