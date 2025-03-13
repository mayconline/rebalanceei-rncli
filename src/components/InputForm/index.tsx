import React, { useContext, useState } from 'react';
import { ThemeContext } from 'styled-components/native';
import { TextInputProps } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import {
  Container,
  InputGroup,
  Label,
  TextCustomInput,
  InputIcon,
} from './styles';

interface IInputProps extends TextInputProps {
  label: string;
  isSecure?: boolean;
  width?: number;
  filled?: number;
  autoCompleteType?: string;
}

const InputForm = ({
  label,
  value,
  defaultValue,
  isSecure = false,
  placeholder,
  autoCompleteType,
  maxLength,
  editable,
  keyboardType,
  returnKeyType = 'next',
  autoCapitalize = 'none',
  autoFocus,
  onFocus,
  onChangeText,
  onEndEditing,
  onSubmitEditing,
  width,
}: IInputProps) => {
  const { color } = useContext(ThemeContext);
  const [visiblePassword, setVisiblePassword] = useState(true);

  return (
    <Container autoFocus={autoFocus} width={width} filled={value?.length}>
      <InputGroup>
        <Label
          accessibilityLabel={label}
          autoFocus={autoFocus}
          filled={value?.length}
        >
          {label}
        </Label>
        <TextCustomInput
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          placeholderTextColor={color.placeholderColor}
          autoCompleteType={autoCompleteType}
          maxLength={maxLength}
          editable={editable}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onChangeText={onChangeText}
          onEndEditing={onEndEditing}
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={isSecure && visiblePassword}
          accessibilityValue={{ text: value }}
          autoCorrect={false}
          autoCapitalize={autoCapitalize}
        />
      </InputGroup>
      {isSecure && (
        <InputIcon
          accessibilityLabel="Ver Senha"
          onPress={() =>
            setVisiblePassword(visiblePassword => !visiblePassword)
          }
        >
          <Entypo
            testID={!visiblePassword ? 'eye-with-line' : 'eye'}
            name={!visiblePassword ? 'eye-with-line' : 'eye'}
            size={24}
            color={!autoFocus ? color.titleNotImport : color.success}
          />
        </InputIcon>
      )}
    </Container>
  );
};

export default InputForm;
