import styled from 'styled-components/native';

interface IButton {
  outlined?: boolean;
}

export const ContainerButton = styled.TouchableOpacity<any>`
  align-items: center;
  padding: 12px 24px;
  border-color: ${({ theme }) => theme.color.bgButtonPrimary};
  border-width: ${({ outlined }) => (outlined ? '1px' : 'undefined')};
  border-radius: 23px;
  background-color: ${({ theme, outlined }) =>
    outlined ? theme.color.bgButtonOutlined : theme.color.bgButtonPrimary};
  flex-direction: row;
  justify-content: center;
`;

export const TextButton = styled.Text<IButton>`
  color: ${({ theme, outlined }) =>
    outlined ? theme.color.bgButtonPrimary : theme.color.activeText};
  font: 600 20px/28px 'TitilliumWeb-SemiBold';
`;
