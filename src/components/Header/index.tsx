import React, { useContext } from 'react';

import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../contexts/authContext';
import { Entypo, MaterialDesignIcons } from '../../services/icons';

import {
  Wrapper,
  Wallet,
  Title,
  Icons,
  Menu,
  MenuBar,
  Logo,
  WrapperLogo,
  UserNameWrapper,
  WalletTitle,
} from './styles';

import { useModalStore } from '../../store/useModalStore';
import RebalanceeiLogo from '../../../assets/svg/RebalanceeiLogo';
import Divider from '../Divider';

const Header = () => {
  const { walletName, userEmail } = useAuth();
  const { color, name } = useContext(ThemeContext);

  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  const userName = `${userEmail?.split('@')[0]}`;

  return (
    <Wrapper>
      <MenuBar>
        <WrapperLogo>
          <Logo>
            <RebalanceeiLogo
              type={name === 'LIGHT' ? 'secondary' : 'primary'}
            />
          </Logo>

          <UserNameWrapper>
            <Title numberOfLines={1} ellipsizeMode="tail">
              {`Olá, ${userName}!`}
            </Title>
          </UserNameWrapper>
        </WrapperLogo>
        <Icons>
          <Menu onPress={() => openModal('Menu')}>
            <MaterialDesignIcons
              name="menu"
              size={32}
              color={color.headerPrimary}
            />
          </Menu>
        </Icons>
      </MenuBar>
      <Divider mt={'4px'} />

      <Wallet onPress={() => openModal('Wallet')}>
        <WalletTitle numberOfLines={1} ellipsizeMode="tail">
          {walletName ?? 'Selecionar Carteira'}
        </WalletTitle>
        <Entypo name="chevron-thin-down" size={16} color={color.title} />
      </Wallet>
    </Wrapper>
  );
};

export default Header;
