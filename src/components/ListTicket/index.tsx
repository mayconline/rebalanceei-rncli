import React from 'react';
import { FlatList, type FlatListProps } from 'react-native';

import { List } from './styles';
import { ListEmpty } from './ListEmpty';

const ListTicket = (props: FlatListProps<any>) => {
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
        ListEmptyComponent={<ListEmpty />}
        contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 12 }}
      />
    </List>
  );
};

export default React.memo(ListTicket);
