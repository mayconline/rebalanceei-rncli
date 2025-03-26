import React from 'react';
import { Bar as ProgressBar } from 'react-native-progress';

import { CardContainerProgress } from './styles';

import {
  formatNumber,
  formatNumberRound,
  formatStatus,
  formatProgress,
} from '../../utils/format';

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
              accessibilityValue={{
                now: formatNumberRound(item.currentPercent),
              }}
              text={`% Atual: ${item.currentPercent.toFixed(1)} %`}
              size={12}
            />

            <CardItem.AmountText
              accessibilityLabel="Porcentagem ideal do ativo"
              accessibilityValue={{ now: formatNumberRound(item.gradePercent) }}
              status={item.status}
              text={`% Ideal: ${item.gradePercent.toFixed(1)} %`}
              size={12}
            />
          </CardContainerProgress>

          <ProgressBar
            indeterminate={false}
            progress={formatProgress(item.gradePercent, item.currentPercent)}
            color={colors.primary['600']}
            unfilledColor={`${colors.primary['600']}40`}
            width={null}
            borderRadius={0}
            borderWidth={0}
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
            accessibilityValue={{ now: formatNumberRound(item.targetAmount) }}
            status={item.status}
            text={formatNumber(item.targetAmount)}
          />
        </CardItem.AmountContent>
      </CardItem>
    </>
  );
};

export default React.memo(ListItem);
