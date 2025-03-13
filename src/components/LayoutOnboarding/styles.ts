import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const WrapperOnboarding = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.color.bgHeaderEmpty};
  flex: 1;
  justify-content: space-between;
`;

export const Header = styled.View`
  flex-direction: row;
  margin-top: 4%;
  justify-content: flex-end;
`;

export const ContainerTextLink = styled.TouchableOpacity`
  padding: 8px 32px;
`;

export const Image = styled.View`
  height: 32%;
  margin-top: 8%;
  justify-content: center;
  align-items: center;
`;

export const TextLink = styled.Text`
  color: ${({ theme }) => theme.color.onboardingSubtitle};
  font: 600 18px/24px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
`;
