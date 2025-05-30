import styled, { css } from 'styled-components/native';

interface IIconButtonProps {
  ml?: string;
  mr?: string;
}

export const ContainerCard = styled.View`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.color.bgItemCard};
  border-radius: 12px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.color.borderItemCard};
  margin-bottom: 12px;
  height: 64px;
`;

export const IconButton = styled.TouchableOpacity<IIconButtonProps>`
  ${({ ml }) =>
    ml &&
    css`
      margin-left: ${ml};
    `}

  ${({ mr }) =>
    mr &&
    css`
      margin-right: ${mr};
    `}
`;

export const CardContent = styled.View`
  flex: 1;
  margin-left: 8px;
`;

export const CardTitleContainer = styled.View`
  flex-direction: row;
`;

export const CardTitleStyle = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 600 16px 'TitilliumWeb-SemiBold';
  font-smooth: antialiased;
  width: 96%;
`;

interface ITextProps {
  opacity?: number;
  size?: number;
}

export const CardSubTitleStyle = styled.Text<ITextProps>`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 400 ${({ size }) => `${size}px`} 'TitilliumWeb-Regular';
  font-smooth: antialiased;

  ${({ opacity }) =>
    opacity &&
    css`
      opacity: ${opacity};
    `}
`;

export const AmountContent = styled.View`
  align-items: flex-end;
  width: 40%;
`;

interface IFormatStatus {
  status?: string;
  variation?: number;
  size: number;
}

export const AmountTextStyle = styled.Text<IFormatStatus>`
  color: ${({ theme, status, variation = 0 }) =>
    status === 'BUY' || variation > 0
      ? theme.color.success
      : status === 'ANALYZE' || variation < 0
      ? theme.color.danger
      : theme.color.titleItemCard};
  font: 600 ${({ size }) => `${size}px`} 'TitilliumWeb-SemiBold';
  font-smooth: antialiased;
`;
