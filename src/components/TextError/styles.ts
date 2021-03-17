import styled from 'styled-components/native';

interface ITextContentError {
  isTabs?: boolean;
}

export const TextContentError = styled.Text<ITextContentError>`
  color: ${({ theme, isTabs }) =>
    !isTabs ? theme.color.warning : theme.color.activeText};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  text-align: center;
  margin-top: -12px;
`;
