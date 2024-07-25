import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatNumber, formatMonth } from '../../utils/format';
import { IEarning } from './index';
import { CardItem } from '../../components/CardItem';

interface IListItem {
  item: IEarning;
  handleOpenEditEarningModal(item: IEarning): void;
}

const ListItem = ({ item, handleOpenEditEarningModal }: IListItem) => {
  const { color } = useContext(ThemeContext);

  const isAccumulated = !item?.month;

  return (
    <CardItem>
      {isAccumulated && (
        <MaterialCommunityIcons
          name={'calendar-sync'}
          size={28}
          color={color.closeIcon}
        />
      )}

      <CardItem.Content>
        <CardItem.AmountText
          accessibilityLabel={isAccumulated ? 'Ano' : 'Mês'}
          accessibilityValue={{
            text: isAccumulated ? String(item.year) : formatMonth(item.month!),
          }}
          text={isAccumulated ? String(item.year) : formatMonth(item.month!)!}
        />

        <CardItem.SubTitle
          accessibilityLabel="Observação"
          accessibilityValue={{
            text: isAccumulated ? 'Acumulado no Ano' : 'Lançamento Manual',
          }}
          text={isAccumulated ? 'Acumulado no Ano' : 'Lançamento Manual'}
        />
      </CardItem.Content>
      <CardItem.AmountContent>
        <CardItem.AmountText
          accessibilityLabel={isAccumulated ? 'Total do Ano' : 'Total do Mês'}
          accessibilityValue={{ now: item.amount }}
          variation={item.amount}
          text={formatNumber(item.amount)}
        />
      </CardItem.AmountContent>

      {!isAccumulated && (
        <CardItem.EditButton onPress={() => handleOpenEditEarningModal(item)} />
      )}
    </CardItem>
  );
};

export default React.memo(ListItem);
