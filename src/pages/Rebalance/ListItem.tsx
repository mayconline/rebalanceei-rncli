import React from 'react';
import { ProgressBar } from '@react-native-community/progress-bar-android';

import { CardContainerProgress } from './styles';

import { formatNumber, formatStatus, formatProgress } from '../../utils/format';

import type { IRebalances } from './index';
import AdBanner from '../../components/AdBanner';
import { colors } from '../../themes/colors';
import { CardItem } from '../../components/CardItem';

const ListItem = ({
  item,
  showAdBanner,
}: {
  item: IRebalances;
  showAdBanner: boolean;
}) => {
  return (
    <>
      {showAdBanner && <AdBanner />}

      <CardItem>
        <CardItem.Content>
          <CardItem.Title symbol={item?.symbol} name={item?.longName} />

          <CardContainerProgress>
            <CardItem.SubTitle
              accessibilityLabel="Porcentagem atual do ativo"
              accessibilityValue={{ now: item.currentPercent }}
              text={`% Atual: ${item.currentPercent.toFixed(1)} %`}
              size={12}
            />

            <CardItem.AmountText
              accessibilityLabel="Porcentagem ideal do ativo"
              accessibilityValue={{ now: item.gradePercent }}
              status={item.status}
              text={`% Ideal: ${item.gradePercent.toFixed(1)} %`}
              size={12}
            />
          </CardContainerProgress>

          <ProgressBar
            styleAttr="Horizontal"
            indeterminate={false}
            progress={formatProgress(item.gradePercent, item.currentPercent)}
            color={colors.primary['600']}
          />
        </CardItem.Content>
        <CardItem.AmountContent>
          <CardItem.AmountText
            accessibilityLabel="Status do ativo"
            accessibilityValue={{ text: item.status }}
            status={item.status}
            text={formatStatus(item.status)}
          />

          <CardItem.AmountText
            accessibilityLabel="Valor para rebalancear o ativo na carteira"
            accessibilityValue={{ now: item.targetAmount }}
            status={item.status}
            text={formatNumber(item.targetAmount)}
          />
        </CardItem.AmountContent>
      </CardItem>
    </>
  );
};

export default React.memo(ListItem);
