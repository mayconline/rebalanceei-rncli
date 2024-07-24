import React, { useContext } from 'react';

import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../contexts/authContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Wrapper,
  Wallet,
  Title,
  Icons,
  Menu,
  MenuBar,
  Logo,
  WrapperLogo,
} from './styles';

import { useModalStore } from '../../store/useModalStore';
import RebalanceeiLogo from '../../../assets/svg/RebalanceeiLogo';
import Divider from '../Divider';

const Header = () => {
  const { walletName } = useAuth();
  const { color, name } = useContext(ThemeContext);

  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  return (
    <Wrapper>
      <MenuBar>
        <WrapperLogo>
          <Logo>
            <RebalanceeiLogo
              type={name === 'LIGHT' ? 'secondary' : 'primary'}
            />
          </Logo>

          <Wallet onPress={() => openModal('Wallet')}>
            <Title numberOfLines={1} ellipsizeMode="tail">
              {walletName ?? 'Selecionar Carteira'}
            </Title>
            <MaterialCommunityIcons
              name="chevron-down"
              size={32}
              color={color.headerPrimary}
            />
          </Wallet>
        </WrapperLogo>
        <Icons>
          <Menu onPress={() => openModal('Menu')}>
            <MaterialCommunityIcons
              name="menu"
              size={32}
              color={color.headerPrimary}
            />
          </Menu>
        </Icons>
      </MenuBar>
      <Divider />
    </Wrapper>
  );
};

export default Header;
