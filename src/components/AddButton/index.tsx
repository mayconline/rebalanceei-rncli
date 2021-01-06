import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';

import { AddButtonProps, Button } from './styles';

const AddButton: React.FC<AddButtonProps> = ({
  onPress,
  focused,
  size,
  mb,
}) => {
  const { color, gradient } = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={onPress}>
      <Button
        colors={gradient.darkToLightBlue}
        focused={focused}
        size={size}
        mb={mb}
      >
        <Feather
          name="plus"
          size={size / 2}
          color={focused ? color.secondary : color.blueLight}
        />
      </Button>
    </TouchableOpacity>
  );
};

export default AddButton;
