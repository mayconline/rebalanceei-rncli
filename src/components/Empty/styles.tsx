import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Main = styled.View`
  margin-bottom: 40px;
`;

export const Image = styled.View`
  height: 280px;
  padding: 16px;
  align-items: center;
`;

export const ContainerTitle = styled.View`
  align-items: center;
  margin: 0 24px;
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.color.onboardingSubtitle};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  text-align: center;
`;

export const Footer = styled.View`
  align-self: center;
`;
