import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

interface IButton {
  outlined?: boolean;
}

export const Gradient = styled(LinearGradient)<any>`
  justify-content: center;
  margin-top: 4px;
  border-radius: 12px;
`;

export const ContainerButton = styled.TouchableOpacity<any>`
  align-items: center;
  padding: 12px 44px;
  border-color: ${({ theme }) => theme.color.blue};
  border-width: ${({ outlined }) => (outlined ? '1px' : 'undefined')};
  border-radius: 12px;
`;

export const TextButton = styled.Text<IButton>`
  color: ${({ theme, outlined }) =>
    outlined ? theme.color.blue : theme.color.activeText};
  font: 600 20px/28px 'TitilliumWeb-SemiBold';
`;
