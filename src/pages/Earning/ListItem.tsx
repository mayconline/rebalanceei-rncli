import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import {
  Content,
  Card,
  CardContent,
  CardTitleContainer,
  CardTicket,
  CardSubTitle,
  Amount,
} from './styles';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatNumber, formatMonth } from '../../utils/format';
import { IEarning } from './index';

interface IListItem {
  item: IEarning;
  handleOpenEditEarningModal(item: IEarning): void;
}

const ListItem = ({ item, handleOpenEditEarningModal }: IListItem) => {
  const { color, gradient } = useContext(ThemeContext);

  const isAccumulated = !item?.month;

  return (
    <Content>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={
          isAccumulated
            ? `Proventos Acumulados ${formatMonth(item.year)}`
            : `Lançamento Manual ${formatMonth(item.month!)}`
        }
        onPress={() => handleOpenEditEarningModal(item)}
        disabled={isAccumulated}
      >
        <Card colors={gradient.lightToGray} variation={item.amount}>
          <MaterialCommunityIcons
            name={isAccumulated ? 'calendar-sync' : 'circle-edit-outline'}
            size={28}
            color={color.blue}
          />

          <CardContent>
            <CardTitleContainer>
              <CardTicket
                accessibilityLabel={isAccumulated ? 'Ano' : 'Mês'}
                accessibilityValue={{
                  text: isAccumulated
                    ? String(item.year)
                    : formatMonth(item.month!),
                }}
              >
                {isAccumulated ? String(item.year) : formatMonth(item.month!)}
              </CardTicket>
            </CardTitleContainer>

            <CardSubTitle
              accessibilityLabel="Observação"
              accessibilityValue={{
                text: isAccumulated ? 'Acumulado no Ano' : 'Lançamento Manual',
              }}
            >
              {isAccumulated ? 'Acumulado no Ano' : 'Lançamento Manual'}
            </CardSubTitle>
          </CardContent>
          <Amount
            accessibilityLabel={isAccumulated ? 'Total do Ano' : 'Total do Mês'}
            accessibilityValue={{ now: item.amount }}
            variation={item.amount}
          >
            {formatNumber(item.amount)}
          </Amount>
        </Card>
      </TouchableOpacity>
    </Content>
  );
};

export default React.memo(ListItem);
