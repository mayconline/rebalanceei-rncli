import React, { useContext, useState } from 'react';
import { Modal } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../contexts/authContext';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Wrapper, Wallet, Title, Icons, Menu, MenuBar } from './styles';

import WalletModal from '../../modals/WalletModal';
import MenuModal from '../../modals/MenuModal';

const Header = () => {
  const { walletName, setSelectTheme } = useAuth();
  const { color, gradient, name } = useContext(ThemeContext);

  const [openModal, setOpenModal] = useState<'Wallet' | 'Menu' | null>(null);

  return (
    <>
      <Wrapper colors={gradient.darkToLightGreen}>
        <MenuBar>
          <Wallet onPress={() => setOpenModal('Wallet')}>
            <Title numberOfLines={1} ellipsizeMode="tail">
              {walletName ?? 'Selecionar Carteira'}
            </Title>
            <Entypo
              name="chevron-thin-down"
              size={20}
              color={color.activeText}
            />
          </Wallet>
          <Icons>
            <Menu
              onPress={() =>
                setSelectTheme(name === 'LIGHT' ? 'DARK' : 'LIGHT')
              }
            >
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={28}
                color={color.activeText}
              />
            </Menu>
            <Menu onPress={() => setOpenModal('Menu')}>
              <Entypo
                name="dots-three-vertical"
                size={20}
                color={color.activeText}
              />
            </Menu>
          </Icons>
        </MenuBar>
      </Wrapper>

      {openModal === 'Wallet' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'Wallet'}
          statusBarTranslucent={true}
        >
          <WalletModal onClose={() => setOpenModal(null)} />
        </Modal>
      )}

      {openModal === 'Menu' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'Menu'}
          statusBarTranslucent={true}
        >
          <MenuModal onClose={() => setOpenModal(null)} />
        </Modal>
      )}
    </>
  );
};

export default Header;
