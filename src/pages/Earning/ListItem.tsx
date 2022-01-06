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

  return (
    <Content>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Lançamento Manual ${formatMonth(item.month)}`}
        onPress={() => handleOpenEditEarningModal(item)}
      >
        <Card colors={gradient.lightToGray} variation={item.amount}>
          <MaterialCommunityIcons
            name="circle-edit-outline"
            size={28}
            color={color.blue}
          />
          <CardContent>
            <CardTitleContainer>
              <CardTicket
                accessibilityLabel="Mês"
                accessibilityValue={{ text: formatMonth(item.month) }}
              >
                {formatMonth(item.month)}
              </CardTicket>
            </CardTitleContainer>
            <CardSubTitle
              accessibilityLabel="Observação"
              accessibilityValue={{
                text: `Lançamento Manual`,
              }}
            >
              {`Lançamento manual`}
            </CardSubTitle>
          </CardContent>
          <Amount
            accessibilityLabel="Total do Mês"
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
