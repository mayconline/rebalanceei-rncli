import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Wrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.primary};
  justify-content: space-around;
`;

export const LootieContainer = styled.View`
  min-height: 200px;
`;

export const Image = styled.View`
  height: 280px;
`;

export const ContainerTitle = styled.View`
  align-items: center;
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.color.activeText};
  font: 400 28px/56px 'TitilliumWeb-Regular';
  opacity: 0.5;
`;

export const Footer = styled.View``;
