import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Wrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.bgHeaderEmpty};
  elevation: 5;
`;

export const Image = styled.View`
  height: 240px;
  padding: 16px;
  align-items: center;
`;

export const ContainerTitle = styled.View`
  margin-top: 40px;
  flex-direction: row;
  justify-content: space-between;
`;

export const BackIcon = styled.TouchableOpacity`
  margin-right: 8%;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 600 24px/32px 'TitilliumWeb-SemiBold';
  text-align: center;
  flex: 1;
  margin-left: 12%;
`;

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.bgHeaderEmpty};
  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const Question = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px/24px 'TitilliumWeb-Regular';
`;
