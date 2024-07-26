import React, { Fragment, useCallback, useContext, useState } from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '../../contexts/authContext';
import { getTerms } from '../../utils/Terms';
import Divider from '../../components/Divider';

import UpdateUserModal from '../UpdateUserModal';
import HelpModal from '../HelpModal';

import {
  Wrapper,
  TitleContainer,
  Title,
  BackIcon,
  MenuContainer,
  Menu,
  MenuIcon,
  MenuTitle,
  ScrollView,
} from './styles';
import { ThemeContext } from 'styled-components/native';
import useAmplitude from '../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';
import { useModalStore } from '../../store/useModalStore';
import { Modal } from '../../components/Modal';

const menuItens = [
  {
    lib: MaterialCommunityIcons,
    icon: 'face-man-profile',
    description: 'Minha Conta',
  },
  {
    lib: MaterialCommunityIcons,
    icon: 'crown',
    description: 'Meu Plano Atual',
  },
  {
    lib: MaterialCommunityIcons,
    icon: 'theme-light-dark',
    description: 'Modo Escuro',
  },
  {
    lib: MaterialCommunityIcons,
    icon: 'help-circle',
    description: 'Ajuda',
  },
  {
    lib: MaterialCommunityIcons,
    icon: 'application-cog-outline',
    description: 'Versão do APP - v1.7.20',
  },
  {
    lib: MaterialCommunityIcons,
    icon: 'shield-check',
    description: 'Termos de Uso',
  },
  {
    lib: MaterialCommunityIcons,
    icon: 'logout-variant',
    description: 'Sair',
  },
];

interface MenuProps {
  onClose(): void;
}

const MenuModal = ({ onClose }: MenuProps) => {
  const { logEvent } = useAmplitude();

  const { color, name } = useContext(ThemeContext);
  const { handleSignOut, setSelectTheme } = useAuth();
  const { openModal: openPlanModal } = useModalStore(({ openModal }) => ({
    openModal,
  }));

  const [openModal, setOpenModal] = useState<'User' | 'Help' | null>(null);

  useFocusEffect(
    useCallback(() => {
      logEvent('open Menu Modal');
    }, []),
  );

  const onSignOut = useCallback(() => {
    onClose();
    handleSignOut();
  }, []);

  const handleClickMenu = (description: string) => {
    logEvent(`click on ${description} at Menu Modal`);

    switch (description) {
      case 'Minha Conta':
        return setOpenModal('User');
      case 'Meu Plano Atual':
        return openPlanModal('PLAN');
      case 'Modo Escuro':
        return setSelectTheme(name === 'LIGHT' ? 'DARK' : 'LIGHT');
      case 'Ajuda':
        return setOpenModal('Help');
      case 'Versão do APP - v1.7.20':
        return;
      case 'Termos de Uso':
        return getTerms();
      case 'Sair':
        return onSignOut();
      default:
        return;
    }
  };

  return (
    <>
      <Wrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TitleContainer>
            <Title accessibilityRole="header">Menu</Title>
            <BackIcon
              accessibilityRole="imagebutton"
              accessibilityLabel="Voltar"
              onPress={onClose}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={color.closeIcon}
              />
            </BackIcon>
          </TitleContainer>

          <MenuContainer accessibilityRole="menu">
            {menuItens?.map((menuItem, index) => {
              const { lib: Icon, icon, description } = menuItem;

              return (
                <Fragment key={description}>
                  {index !== 0 && <Divider mt={'8px'} />}

                  <Menu
                    onPress={() => {
                      handleClickMenu(description);
                    }}
                    accessibilityRole="menuitem"
                    accessibilityLabel={description}
                  >
                    <MenuIcon>
                      <Icon name={icon} size={20} color={color.menuIconColor} />
                    </MenuIcon>
                    <MenuTitle numberOfLines={1} ellipsizeMode="tail">
                      {description === 'Modo Escuro'
                        ? name === 'LIGHT'
                          ? description
                          : 'Modo Claro'
                        : description}
                    </MenuTitle>
                  </Menu>
                </Fragment>
              );
            })}
          </MenuContainer>
        </ScrollView>
      </Wrapper>

      {openModal === 'User' && (
        <Modal>
          <UpdateUserModal onClose={() => setOpenModal(null)} />
        </Modal>
      )}

      {openModal === 'Help' && (
        <Modal>
          <HelpModal onClose={() => setOpenModal(null)} />
        </Modal>
      )}
    </>
  );
};

export default MenuModal;
