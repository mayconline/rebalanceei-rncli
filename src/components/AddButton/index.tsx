import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { Feather } from '../../services/icons';

import { type AddButtonProps, Button } from './styles';

const AddButton = ({ onPress, focused, size, mb }: AddButtonProps) => {
  const { color } = useContext(ThemeContext);

  return (
    <Button focused={focused} size={size} mb={mb} onPress={onPress}>
      <Feather
        name="plus"
        size={size / 2}
        color={focused ? color.activeText : color.blueLight}
      />
    </Button>
  );
};

export default AddButton;
