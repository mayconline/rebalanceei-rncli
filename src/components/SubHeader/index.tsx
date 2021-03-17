import React, { useContext, useRef } from 'react';
import { ScrollView } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {
  Wrapper,
  ContainerTitle,
  Title,
  SubTitle,
  FiltersContainer,
  Filter,
  TextFilter,
} from './styles';
import { formatFilter } from '../../utils/format';

interface ISubHeaderProps {
  title: string;
  count: number;
  filters?: IFilters[];
  selectedFilter?: string;
  onPress(filter: string): void;
}

interface IFilters {
  name: string;
}

const SubHeader: React.FC<ISubHeaderProps> = ({
  title,
  count,
  filters,
  selectedFilter,
  onPress,
  children,
}) => {
  const { color } = useContext(ThemeContext);

  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <Wrapper>
      <ContainerTitle>
        <Title accessibilityRole="header">{title}</Title>
        <SubTitle>{count} Itens</SubTitle>
      </ContainerTitle>

      {children}
      <FiltersContainer>
        <ScrollView
          horizontal={true}
          centerContent={true}
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef?.current?.scrollToEnd({ animated: true })
          }
        >
          {filters?.map(filter => (
            <Filter key={filter.name} onPress={() => onPress(filter.name)}>
              <TextFilter focused={filter.name === selectedFilter}>
                {formatFilter(filter.name)}
              </TextFilter>
            </Filter>
          ))}
        </ScrollView>
        <FontAwesome5 name="sort-amount-up" size={24} color={color.title} />
      </FiltersContainer>
    </Wrapper>
  );
};

export default SubHeader;
