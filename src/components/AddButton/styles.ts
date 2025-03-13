import styled, { css } from 'styled-components/native';

import { TouchableOpacityProps } from 'react-native';

export interface AddButtonProps extends TouchableOpacityProps {
  onPress?(): void;
  focused?: boolean;
  size: number;
  mb?: number;
}

export const Button = styled.TouchableOpacity<AddButtonProps | any>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.bgAddButton};
  border: 3px solid ${({ theme }) => theme.color.borderAddButton};

  ${({ mb }) =>
    mb &&
    css`
      margin-bottom: ${mb}px;
    `}
`;
