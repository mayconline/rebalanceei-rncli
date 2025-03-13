import { useCallback, useContext } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { MenuButton, MenuButtonText, MenuWrapper } from './styles';
import { ThemeContext } from 'styled-components/native';
import useAmplitude from '../../hooks/useAmplitude';
import { useModalStore } from '../../store/useModalStore';

interface IRentabilityMenuTabProps {
  menuTitles: string[];
  selectedMenu?: string;
  handleChangeMenu: (menu: string) => void;
  verifyPremiumFilter: (filterName: string) => boolean;
}

export const RentabilityMenuTab = ({
  menuTitles,
  selectedMenu,
  handleChangeMenu,
  verifyPremiumFilter,
}: IRentabilityMenuTabProps) => {
  const { logEvent } = useAmplitude();
  const { color } = useContext(ThemeContext);
  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  const handleSelectMenu = useCallback((menu: string) => {
    logEvent(`selected ${menu} menu`);

    if (verifyPremiumFilter(menu)) {
      openModal('PLAN');
    } else {
      handleChangeMenu(menu);
    }
  }, []);

  return (
    <MenuWrapper>
      {menuTitles?.map(menu => (
        <MenuButton key={menu} onPress={() => handleSelectMenu(menu)}>
          <MenuButtonText
            focused={menu === selectedMenu}
            accessibilityRole="header"
          >
            <FontAwesome5
              name={menu === 'Proventos' ? 'donate' : 'wallet'}
              size={20}
              color={
                menu === selectedMenu
                  ? color.filterFocused
                  : color.filterDisabled
              }
            />{' '}
            {menu}
          </MenuButtonText>
        </MenuButton>
      ))}
    </MenuWrapper>
  );
};
