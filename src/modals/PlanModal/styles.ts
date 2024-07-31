import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Wrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.bgHeaderEmpty};
`;

export const ScrollView = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.bgHeaderEmpty};

  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const ContainerTitle = styled.View`
  margin: 16px 0;
  flex-direction: row;
  justify-content: space-between;
`;

export const BackIcon = styled.TouchableOpacity`
  padding-right: 8px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 20px/24px 'TitilliumWeb-SemiBold';
  text-align: center;
  flex: 1;
  font-smooth: 'antialiased';
`;

export const ContainerButtons = styled.View`
  align-items: center;
  justify-content: center;
  margin: 4% auto;
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 400 16px/20px 'TitilliumWeb-Regular';
  flex: 1;
  margin: 12px 0;
  opacity: 0.5;
  font-smooth: 'antialiased';
`;
