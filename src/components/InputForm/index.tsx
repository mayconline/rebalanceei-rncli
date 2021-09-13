import React, { useContext, useState, useRef } from 'react';
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

  const inputRef = useRef<any>(null);

  const handleFocusInput = () => {
    inputRef.current?.blur();
    inputRef.current?.focus();
  };

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
          ref={inputRef}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          placeholderTextColor={color.titleNotImport}
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
          onPressIn={handleFocusInput}
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
