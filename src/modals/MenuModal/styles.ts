import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Wrapper = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  max-height: 80%;
  width: 60%;
  position: absolute;
  top: 8%;
  right: 0;
  elevation: 5;
`;

export const ScrollView = styled.ScrollView``;

export const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 600 18px/20px 'TitilliumWeb-SemiBold';
  margin: 12px 8px;
  padding-bottom: 8px;
  flex: 1;
  font-smooth: antialiased;
`;

export const BackIcon = styled.TouchableOpacity`
  margin-top: 8px;
`;

export const MenuContainer = styled.View``;

export const Menu = styled.TouchableOpacity`
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  padding: 8px;
`;

export const MenuIcon = styled.View`
  margin-right: 8px;
`;

export const MenuTitle = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 14px/20px 'TitilliumWeb-SemiBold';
  max-width: 80%;
  font-smooth: antialiased;
`;
