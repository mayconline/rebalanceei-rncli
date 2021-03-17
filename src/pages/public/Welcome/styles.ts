import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.primary};
  justify-content: space-around;
`;

export const Header = styled.View`
  justify-content: space-between;
`;

export const Logo = styled.View`
  height: 200px;
`;

export const ContainerTitle = styled.View`
  align-items: center;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.activeText};
  font: 300 48px/56px 'TitilliumWeb-Regular';
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.color.activeText};
  font: 400 28px/56px 'TitilliumWeb-Regular';
  opacity: 0.5;
`;

export const Footer = styled.View``;

export const ButtonContainer = styled.TouchableOpacity`
  align-items: center;
  padding: 12px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.color.activeText};
  border-radius: 24px;
  align-self: center;
  width: 80%;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.color.blue};
  font: 600 20px/28px 'TitilliumWeb-SemiBold';
`;
