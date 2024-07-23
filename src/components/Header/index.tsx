import React, { useContext } from 'react';

import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../contexts/authContext';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Wrapper, Wallet, Title, Icons, Menu, MenuBar } from './styles';

import { useModalStore } from '../../store/useModalStore';

const Header = () => {
  const { walletName, setSelectTheme } = useAuth();
  const { color, name } = useContext(ThemeContext);

  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  return (
    <Wrapper>
      <MenuBar>
        <Wallet onPress={() => openModal('Wallet')}>
          <Title numberOfLines={1} ellipsizeMode="tail">
            {walletName ?? 'Selecionar Carteira'}
          </Title>
          <Entypo
            name="chevron-thin-down"
            size={20}
            color={color.headerPrimary}
          />
        </Wallet>
        <Icons>
          <Menu
            onPress={() => setSelectTheme(name === 'LIGHT' ? 'DARK' : 'LIGHT')}
          >
            <MaterialCommunityIcons
              name="theme-light-dark"
              size={28}
              color={color.headerPrimary}
            />
          </Menu>
          <Menu onPress={() => openModal('Menu')}>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={color.headerPrimary}
            />
          </Menu>
        </Icons>
      </MenuBar>
    </Wrapper>
  );
};

export default Header;
