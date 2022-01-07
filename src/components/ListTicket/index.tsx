import React, { useContext } from 'react';
import { ActivityIndicator, FlatList, FlatListProps } from 'react-native';
import { ThemeContext } from 'styled-components/native';

import { List } from './styles';

const ListTicket = (props: FlatListProps<any>) => {
  const { color } = useContext(ThemeContext);

  return (
    <List>
      <FlatList
        {...props}
        removeClippedSubviews={false}
        initialNumToRender={5}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={600}
        automaticallyAdjustContentInsets={false}
        style={{ flex: 0 }}
        ListEmptyComponent={
          <ActivityIndicator size="small" color={color.filterDisabled} />
        }
      />
    </List>
  );
};

export default React.memo(ListTicket);
