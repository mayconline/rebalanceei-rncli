import styled, { css } from 'styled-components/native';

export interface IDividerProps {
  mt?: string;
  mb?: string;
  ml?: string;
  mr?: string;
}

export const Wrapper = styled.View<IDividerProps>`
  border: 0.3px solid ${({ theme }) => theme.color.divider};
  margin: 8px 0;

  ${({ mt }) =>
    mt &&
    css`
      margin-top: ${mt};
    `}

  ${({ mb }) =>
    mb &&
    css`
      margin-bottom: ${mb};
    `}

  ${({ ml }) =>
    ml &&
    css`
      margin-left: ${ml};
    `}

  ${({ mr }) =>
    mr &&
    css`
      margin-right: ${mr};
    `}
`;
