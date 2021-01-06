import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Gradient, ContainerButton, TextButton } from './styles';

interface IButtonProps extends TouchableOpacityProps {
  children: string;
  colors: string[];
  loading?: boolean;
}

const Button = ({ children, colors, loading, ...rest }: IButtonProps) => {
  return (
    <Gradient colors={colors} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0.5 }}>
      <ContainerButton {...rest}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <TextButton accessibilityRole="button">{children}</TextButton>
        )}
      </ContainerButton>
    </Gradient>
  );
};

export default Button;
