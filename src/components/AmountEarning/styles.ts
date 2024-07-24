import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

export const Wrapper = styled.SafeAreaView`
  flex: 0;
`;

export const Card = styled(LinearGradient)<any>`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  margin: 4px 12px;
  border-radius: 30px;
  padding: 8px 20px;
  border-left-color: ${({ theme, isPositive }) =>
    isPositive ? theme.color.success : theme.color.subtitle};
  border-left-width: 2px;
`;

export const WalletContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex: 1;
  padding: 4px;
`;

export const PreviousContainer = styled.View``;

export const CurrentContainer = styled.View`
  align-items: flex-end;
`;

export const PreviousTitle = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 600 16px/20px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
`;
export const CurrentTitle = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 600 16px/20px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
`;

export const PreviousAmount = styled.Text`
  color: ${({ theme }) => theme.color.subtitle};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  padding-left: 8px;
  font-smooth: 'antialiased';
`;

export const CurrentAmount = styled.Text<any>`
  color: ${({ theme, isPositive }) =>
    isPositive ? theme.color.success : theme.color.subtitle};
  font: ${({ isPositive }) =>
    isPositive
      ? "600 16px/24px 'TitilliumWeb-SemiBold'"
      : "400 16px/24px 'TitilliumWeb-Regular'"};

  padding-left: 8px;
  font-smooth: 'antialiased';
`;
