import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Wrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.bgHeaderEmpty};
  justify-content: space-around;
`;

export const LootieContainer = styled.View`
  min-height: 200px;
`;

export const Image = styled.View`
  height: 280px;
  justify-content: center;
  align-items: center;
`;

export const ContainerTitle = styled.View`
  align-items: center;
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.color.onboardingSubtitle};
  font: 400 32px/56px 'TitilliumWeb-Regular';
`;

export const Footer = styled.View``;
