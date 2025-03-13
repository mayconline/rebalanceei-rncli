import styled, { css } from 'styled-components/native';

interface IButton {
  outlined?: boolean;
}

export const ContainerButton = styled.TouchableOpacity<any>`
  align-items: center;
  padding: 12px 16px;
  border-color: ${({ theme }) => theme.color.bgButtonPrimary};
  border-width: ${({ outlined }) => (outlined ? '1px' : '0px')};
  border-radius: 24px;
  background-color: ${({ theme, outlined }) =>
    outlined ? theme.color.bgButtonOutlined : theme.color.bgButtonPrimary};
  flex-direction: row;
  justify-content: center;
  min-width: 100px;

  ${({ mb }) =>
    mb &&
    css`
      margin-bottom: ${mb}px;
    `}
`;

export const TextButton = styled.Text<IButton>`
  color: ${({ theme, outlined }) =>
    outlined ? theme.color.bgButtonPrimary : theme.color.activeText};
  font: 600 20px/24px 'TitilliumWeb-SemiBold';
  letter-spacing: 1.25px;
  font-smooth: 'antialiased';
  margin-top: 2px;
`;
