import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { ContainerButton, TextButton } from './styles';
import { colors } from '../../themes/colors';

interface IButtonProps extends TouchableOpacityProps {
  children: string;
  loading?: boolean;
  outlined?: boolean;
  mb?: number;
}

const Button = ({
  children,
  loading,
  outlined,
  onPress,
  ...rest
}: IButtonProps) => {
  return (
    <ContainerButton
      outlined={outlined}
      disabled={loading}
      onPress={!loading ? onPress : null}
      {...rest}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={outlined ? colors.secondary['400'] : colors.primary['100']}
          style={{ marginRight: 4 }}
        />
      )}

      <TextButton accessibilityRole="button" outlined={outlined}>
        {children}
      </TextButton>
    </ContainerButton>
  );
};

export default Button;
