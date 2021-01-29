import React from 'react';
import { formatErrors } from '../../utils/format';
import { TextContentError } from './styles';

interface ITextError {
  children: string;
  isTabs?: boolean;
}

const TextError = ({ children, isTabs }: ITextError) => (
  <TextContentError isTabs={isTabs} numberOfLines={1} ellipsizeMode="tail">
    {formatErrors(children)}
  </TextContentError>
);

export default TextError;
