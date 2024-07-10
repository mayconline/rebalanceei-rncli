import { memo, ReactNode } from 'react';
import { ContainerCard, Content } from './styles';
import { colors } from '../../themes/colors';

interface ICardItemProps {
  children: ReactNode;
}

const CardItem = ({ children }: ICardItemProps) => {
  return (
    <Content>
      <ContainerCard style={colors.shadow.card}>{children}</ContainerCard>
    </Content>
  );
};

export default memo(CardItem);
