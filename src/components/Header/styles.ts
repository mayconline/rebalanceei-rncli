import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  min-height: 12%;
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
  padding: 4% 8%;
  justify-content: space-between;
  max-width: 70%;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.headerPrimary};
  font: 600 24px/32px 'TitilliumWeb-SemiBold';
  margin-right: 4%;
  max-width: 70%;
`;

export const Icons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Menu = styled.TouchableOpacity`
  padding: 0 24px;
`;
