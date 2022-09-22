import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

import ImageEmptyList from '../../../assets/svg/imageEmptyList';

import { List, Image, TextLink, ContainerTitle } from './styles';

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
        ListEmptyComponent={
          <>
            <Image>
              <ImageEmptyList />
            </Image>
            <ContainerTitle>
              <TextLink>Nenhum item encontrado</TextLink>
            </ContainerTitle>
          </>
        }
      />
    </List>
  );
};

export default React.memo(ListTicket);
