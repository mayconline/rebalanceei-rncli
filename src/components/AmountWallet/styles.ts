import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  margin: 16px 0;
`;

export const WalletContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex: 1;
`;

export const PreviousContainer = styled.View``;

export const CurrentContainer = styled.View`
  align-items: flex-end;
`;

export const PreviousTitle = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 600 16px/20px 'TitilliumWeb-SemiBold';
`;
export const CurrentTitle = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 600 16px/20px 'TitilliumWeb-SemiBold';
`;

export const PreviousAmount = styled.Text`
  color: ${({ theme }) => theme.color.subtitle};
  font: 400 16px/20px 'TitilliumWeb-Regular';
  padding-left: 8px;
  padding-top: 4px;
`;

export const CurrentAmountContainer = styled.View`
  flex-direction: row;
`;

export const CurrentAmount = styled.Text`
  color: ${({ theme }) => theme.color.subtitle};
  font: 400 16px/20px 'TitilliumWeb-Regular';
  padding-left: 8px;
  padding-top: 4px;
`;

export const VariationAmount = styled.Text<any>`
  color: ${({ theme, isPositive }) =>
    isPositive ? theme.color.success : theme.color.danger};
  font: 600 16px/20px 'TitilliumWeb-SemiBold';
  align-self: flex-end;
`;
