import { View } from 'react-native';
import { formatNumber, formatNumberRound } from '../../utils/format';
import { Title } from './styles';

interface IListFooter {
  sumAmountAllWallet: number;
  walletLength: number;
}

export const ListFooter = ({
  sumAmountAllWallet,
  walletLength,
}: IListFooter) => {
  return (
    <View>
      <Title
        accessibilityRole="summary"
        accessibilityLabel="Valor total somado das carteiras"
        accessibilityValue={{
          now: formatNumberRound(sumAmountAllWallet),
        }}
      >
        Total: {formatNumber(sumAmountAllWallet)}
      </Title>
      <Title>
        {!walletLength && 'Adicione uma Carteira clicando no botão abaixo.'}
      </Title>
    </View>
  );
};
