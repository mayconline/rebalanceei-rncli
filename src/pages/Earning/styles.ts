import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

interface IVariation {
  variation: number;
}

export const Content = styled.View`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 4px 12px 0;
  flex: 0;
`;

export const Card = styled(LinearGradient)<IVariation>`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  margin: 4px 0;
  border-radius: 30px;
  padding: 8px 20px;
  border-left-color: ${({ theme, variation }) =>
    variation > 0
      ? theme.color.success
      : variation < 0
      ? theme.color.danger
      : theme.color.subtitle};
  border-left-width: 2px;
`;

export const CardContent = styled.View`
  flex: 1;
  padding: 0 16px;
`;

export const CardTitleContainer = styled.View`
  flex-direction: row;
`;

export const CardTicket = styled.Text`
  color: ${({ theme }) => theme.color.subtitle};
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  font-family: 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
`;

export const CardSubTitle = styled.Text`
  color: ${({ theme }) => theme.color.subtitle};
  font-size: 12px;
  line-height: 24px;
  font-family: 'TitilliumWeb-Regular';
  font-smooth: 'antialiased';
`;
export const Amount = styled.Text<IVariation>`
  color: ${({ theme, variation }) =>
    variation > 0
      ? theme.color.success
      : variation < 0
      ? theme.color.danger
      : theme.color.subtitle};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
`;
