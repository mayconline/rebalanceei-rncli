import styled, { css } from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacityProps } from 'react-native';

export interface AddButtonProps extends TouchableOpacityProps {
  onPress?(): void;
  focused?: boolean;
  size: number;
  mb?: number;
}

export const Button = styled(LinearGradient)<AddButtonProps | any>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  border: 3px solid
    ${({ focused, theme }) =>
      focused ? theme.color.activeText : theme.color.blueLight};

  ${({ mb }) =>
    mb &&
    css`
      margin-bottom: ${mb}px;
    `}
`;
