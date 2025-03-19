import {
  memo,
  type NamedExoticComponent,
  type ReactNode,
  useContext,
} from 'react';
import {
  CardContent,
  CardTitleStyle,
  CardTitleContainer,
  ContainerCard,
  IconButton,
  CardSubTitleStyle,
  AmountContent,
  AmountTextStyle,
} from './styles';
import { colors } from '../../themes/colors';
import Feather from 'react-native-vector-icons/Feather';
import { formatTicket } from '../../utils/format';
import type { TextProps } from 'react-native';
import { ThemeContext } from 'styled-components/native';

interface ICardItemProps {
  children: ReactNode;
}

interface ICardEditButtonProps {
  ml?: string;
  mr?: string;
  onPress?: () => void;
}

interface IMemoizedCardItemComposed {
  Content: typeof CardContent;
  Title: typeof CardTitle;
  SubTitle: typeof CardSubTitle;
  EditButton: typeof CardEditButton;
  AmountContent: typeof AmountContent;
  AmountText: typeof CardAmountText;
}

interface IBaseCardTitle {
  symbol: string;
  name: string;
}

interface ITextProps extends TextProps {
  accessibilityLabel: string;
  accessibilityValue: { [key: string]: any };
  opacity?: number;
  text: string;
  size?: number;
  variation?: number;
  status?: string;
}

const CardTitle = memo(({ symbol, name }: IBaseCardTitle) => {
  return (
    <CardTitleContainer>
      <CardTitleStyle
        accessibilityLabel="Código do Ativo - Nome do Ativo"
        accessibilityValue={{
          text: `${symbol} '-' ${name}`,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {formatTicket(symbol)} - {formatTicket(name)}
      </CardTitleStyle>
    </CardTitleContainer>
  );
});

const CardSubTitle = memo(
  ({
    accessibilityLabel,
    accessibilityValue,
    opacity,
    text,
    size = 14,
  }: ITextProps) => {
    return (
      <CardSubTitleStyle
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={accessibilityValue}
        opacity={opacity}
        size={size}
      >
        {text}
      </CardSubTitleStyle>
    );
  },
);

const CardEditButton = memo(({ onPress, ...props }: ICardEditButtonProps) => {
  const { color } = useContext(ThemeContext);

  return (
    <IconButton
      accessibilityRole="button"
      accessibilityLabel={'Editar'}
      onPress={onPress}
      {...props}
    >
      <Feather name="edit" size={20} color={color.editItemColor} />
    </IconButton>
  );
});

const CardAmountText = memo(
  ({
    accessibilityLabel,
    accessibilityValue,
    text,
    size = 16,
    variation,
    status,
  }: ITextProps) => {
    return (
      <AmountTextStyle
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={accessibilityValue}
        size={size}
        variation={variation}
        status={status}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {text}
      </AmountTextStyle>
    );
  },
);

const MemoizedBaseCardItem = memo(({ children }: ICardItemProps) => {
  return <ContainerCard style={colors.shadow.card}>{children}</ContainerCard>;
});

const MemoizedCardItem: NamedExoticComponent<ICardItemProps> &
  IMemoizedCardItemComposed = Object.assign(MemoizedBaseCardItem, {
  Content: CardContent,
  Title: CardTitle,
  SubTitle: CardSubTitle,
  EditButton: CardEditButton,
  AmountContent: AmountContent,
  AmountText: CardAmountText,
});

export const CardItem = MemoizedCardItem;
