import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.primary};
`;

export const ScrollView = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.secondary};
  margin-top: 32px;
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
`;

export const ContainerButtons = styled.View`
  align-items: center;
  justify-content: center;
  margin: 8px 0 32px;
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.color.subtitle};
  font: 600 20px/24px 'TitilliumWeb-SemiBold';
  text-align: center;
  flex: 1;
  margin: 12px 0;
`;
