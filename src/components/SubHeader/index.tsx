import React, { useCallback, useContext, useRef } from 'react';
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
import { formatFilter, PREMIUM_FILTER } from '../../utils/format';
import useAmplitude from '../../hooks/useAmplitude';
import { RentabilityMenuTab } from '../RentabilityMenuTab';
import { useAuth } from '../../contexts/authContext';
import { useModalStore } from '../../store/useModalStore';

interface ISubHeaderProps {
  title: string;
  count: number;
  filters?: IFilters[];
  selectedFilter?: string;
  onPress(filter: string): void;
  handleChangeMenu?(menu: string): void;
  menuTitles?: string[];
  selectedMenu?: string;
  children?: React.ReactNode;
  childrenBeforeTitle?: React.ReactNode;
  showCount?: boolean;
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
  handleChangeMenu,
  menuTitles,
  selectedMenu,
  childrenBeforeTitle,
  showCount,
}) => {
  const { logEvent } = useAmplitude();
  const { showBanner } = useAuth();
  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  const { color } = useContext(ThemeContext);
  const scrollViewRef = useRef<ScrollView>(null);

  const verifyPremiumFilter = useCallback((filterName: string) => {
    return PREMIUM_FILTER.includes(filterName) && showBanner;
  }, []);

  const handleSelectFilter = useCallback((filterName: string) => {
    logEvent(`selected ${filterName} filter`);

    if (verifyPremiumFilter(filterName)) {
      openModal('PLAN');
    } else {
      onPress(filterName);
    }
  }, []);

  return (
    <>
      <Wrapper>
        {handleChangeMenu && !!menuTitles?.length && (
          <RentabilityMenuTab
            menuTitles={menuTitles}
            selectedMenu={selectedMenu}
            handleChangeMenu={handleChangeMenu}
            verifyPremiumFilter={verifyPremiumFilter}
          />
        )}

        {childrenBeforeTitle}

        <ContainerTitle>
          <Title accessibilityRole="header">{title}</Title>
          {showCount && <SubTitle>{count} Itens</SubTitle>}
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
              <Filter
                key={filter.name}
                onPress={() => handleSelectFilter(filter.name)}
              >
                <TextFilter focused={filter.name === selectedFilter}>
                  {formatFilter(filter.name)}
                </TextFilter>
              </Filter>
            ))}
          </ScrollView>
          <FontAwesome5 name="sort-amount-up" size={24} color={color.title} />
        </FiltersContainer>
      </Wrapper>
    </>
  );
};

export default SubHeader;
