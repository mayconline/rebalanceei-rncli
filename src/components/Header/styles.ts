import styled from 'styled-components/native';

export const Wrapper = styled.View`
  height: 20%;
  flex-direction: column;
  margin: 0 16px;
`;

export const MenuBar = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const UserNameWrapper = styled.View``;

export const Wallet = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.color.bgSelectWallet};
  border: 1px solid ${({ theme }) => theme.color.success};
  border-radius: 8px;
  margin: 12px auto 8px;
  width: 64%;
  padding: 4px 16px;
`;

export const WalletTitle = styled.Text`
  font: 400 18px 'TitilliumWeb-Regular';
  font-smooth: antialiased;
  text-transform: capitalize;
  color: ${({ theme }) => theme.color.title};
  margin: 0 auto 2px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.headerPrimary};
  font: 400 24px 'TitilliumWeb-Regular';
  margin-right: 8px;
  font-smooth: antialiased;
  text-transform: capitalize;
`;

export const Icons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Menu = styled.TouchableOpacity``;

export const Logo = styled.View`
  height: 68px;
  width: 68px;
`;

export const WrapperLogo = styled.View`
  flex-direction: row;
  align-items: center;
  width: 80%;
  margin-left: -8px;
`;
