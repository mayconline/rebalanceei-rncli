import styled, { css } from 'styled-components/native';

interface IFormatStatus {
  variation?: number;
}

interface ITextProps {
  opacity?: number;
}

export const Wrapper = styled.View`
  margin: 16px 0;
`;

export const WalletContainer = styled.View`
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
`;

export const PreviousContainer = styled.View`
  align-items: center;
`;

export const CurrentContainer = styled.View`
  align-items: center;
`;

export const AmountTitle = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 18px 'TitilliumWeb-Regular';
  font-smooth: antialiased;
  text-align: 'center';
`;

export const AmountValue = styled.Text<ITextProps>`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 400 18px 'TitilliumWeb-Regular';
  padding-left: 8px;
  padding-top: 4px;
  font-smooth: antialiased;

  ${({ opacity }) =>
    opacity &&
    css`
      opacity: ${opacity};
    `}
`;

export const CurrentAmountContainer = styled.View`
  flex-direction: row;
`;

export const VariationAmount = styled.Text<IFormatStatus>`
  color: ${({ theme, variation = 0 }) =>
    variation > 0
      ? theme.color.success
      : variation < 0
        ? theme.color.danger
        : theme.color.titleItemCard};
  font: 600 18px 'TitilliumWeb-Semibold';
  align-self: flex-end;
  font-smooth: antialiased;
`;
