import styled from 'styled-components/native';

interface IFocusProps {
  autoFocus?: boolean;
  width?: number;
  filled?: number;
}

export const Container = styled.View<IFocusProps>`
  width: ${({ width }) => (width ? `${width}%` : '100%')};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border-bottom-color: ${({ theme, autoFocus, filled }) =>
    autoFocus || filled ? theme.color.success : theme.color.divider};
  border-bottom-width: 1px;
`;

export const InputGroup = styled.View`
  flex: 1;
`;

export const Label = styled.Text<IFocusProps>`
  color: ${({ theme, autoFocus }) =>
    autoFocus ? theme.color.success : theme.color.titleItemCard};
  font: 400 16px 'TitilliumWeb-Regular';
  font-smooth: 'antialiased';
`;

export const TextCustomInput = styled.TextInput`
  color: ${({ theme }) => theme.color.titleItemCard};
  height: 40px;
  font: 600 16px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
`;

export const InputIcon = styled.TouchableOpacity`
  padding-top: 12px;
`;
