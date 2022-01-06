import React, { useCallback, useContext, useRef, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
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
  MenuButton,
  MenuButtonText,
} from './styles';
import { formatFilter, PREMIUM_FILTER } from '../../utils/format';
import useAmplitude from '../../hooks/useAmplitude';
import { useAuth } from '../../contexts/authContext';
import PlanModal from '../../modals/PlanModal';

interface ISubHeaderProps {
  title: string;
  count: number;
  filters?: IFilters[];
  selectedFilter?: string;
  onPress(filter: string): void;
  handleChangeMenu?(menu: string): void;
  menuTitles?: string[];
  selectedMenu?: string;
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
}) => {
  const { logEvent } = useAmplitude();
  const { showBanner } = useAuth();

  const { color } = useContext(ThemeContext);
  const [openModal, setOpenModal] = useState<'Plan' | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleSelectFilter = useCallback((filterName: string) => {
    logEvent(`selected ${filterName} filter`);

    if (PREMIUM_FILTER.includes(filterName) && showBanner) {
      setOpenModal('Plan');
    } else {
      onPress(filterName);
    }
  }, []);

  const handleClosePlanModal = useCallback(async () => {
    setOpenModal(null);
  }, []);

  return (
    <>
      <Wrapper>
        <ContainerTitle>
          {!!menuTitles?.length && handleChangeMenu ? (
            menuTitles?.map(menu => (
              <MenuButton key={menu} onPress={() => handleChangeMenu(menu)}>
                <MenuButtonText
                  focused={menu === selectedMenu}
                  accessibilityRole="header"
                >
                  {menu}
                </MenuButtonText>
              </MenuButton>
            ))
          ) : (
            <>
              <Title accessibilityRole="header">{title}</Title>
              <SubTitle>{count} Itens</SubTitle>
            </>
          )}
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

      {openModal === 'Plan' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'Plan'}
          statusBarTranslucent={true}
        >
          <PlanModal onClose={handleClosePlanModal} />
        </Modal>
      )}
    </>
  );
};

export default SubHeader;
