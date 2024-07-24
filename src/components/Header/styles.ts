import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  min-height: 12%;
  flex-direction: column;
  margin: 0 16px;
`;

export const MenuBar = styled.SafeAreaView`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Wallet = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 8% 0;
  justify-content: space-between;
  margin-left: 8px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.headerPrimary};
  font: 400 24px 'TitilliumWeb-Regular';
  margin-right: 4px;
  font-smooth: antialiased;
`;

export const Icons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Menu = styled.TouchableOpacity``;

export const Logo = styled.View`
  height: 80px;
  width: 80px;
`;

export const WrapperLogo = styled.View`
  flex-direction: row;
  align-items: center;
  width: 80%;
  margin-left: -8px;
`;
