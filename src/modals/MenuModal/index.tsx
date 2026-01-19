import React, { Fragment, useCallback, useContext, useState } from 'react';

import { MaterialDesignIcons } from '../../services/icons';

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
import { useXLS } from '../../hooks/useXLS';
import { useQuery } from '@apollo/client';
import type { TicketResponseProps } from '../../types/ticketsProps';
import { GET_TICKETS_BY_WALLET } from '../../graphql/queries';

const menuItens = [
  {
    lib: MaterialDesignIcons,
    icon: 'face-man-profile',
    description: 'Minha Conta',
  },
  {
    lib: MaterialDesignIcons,
    icon: 'crown',
    description: 'Meu Plano Atual',
  },
  {
    lib: MaterialDesignIcons,
    icon: 'file-export-outline',
    description: 'Exportar Carteira',
  },
  {
    lib: MaterialDesignIcons,
    icon: 'theme-light-dark',
    description: 'Modo Escuro',
  },
  {
    lib: MaterialDesignIcons,
    icon: 'help-circle',
    description: 'Ajuda',
  },
  {
    lib: MaterialDesignIcons,
    icon: 'application-cog-outline',
    description: 'Versão do APP - v2.3.0',
  },
  {
    lib: MaterialDesignIcons,
    icon: 'shield-check',
    description: 'Termos de Uso',
  },
  {
    lib: MaterialDesignIcons,
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
  const { handleSignOut, setSelectTheme, walletName, wallet } = useAuth();
  const { openModal: openPlanModal } = useModalStore(({ openModal }) => ({
    openModal,
  }));

  const { data } = useQuery<TicketResponseProps>(GET_TICKETS_BY_WALLET, {
    variables: { walletID: wallet, sort: 'grade' },
    fetchPolicy: 'cache-first',
    skip: !wallet,
  });

  const { handleShareXLS } = useXLS({
    tickets: data?.getTicketsByWallet || [],
    walletName,
  });

  const [openModal, setOpenModal] = useState<'User' | 'Help' | null>(null);

  useFocusEffect(
    useCallback(() => {
      logEvent('open Menu Modal');
    }, [logEvent])
  );

  const onSignOut = useCallback(() => {
    onClose();
    handleSignOut();
  }, [onClose, handleSignOut]);

  const handleClickMenu = (description: string) => {
    logEvent(`click on ${description} at Menu Modal`);

    switch (description) {
      case 'Minha Conta':
        return setOpenModal('User');
      case 'Meu Plano Atual':
        return openPlanModal('PLAN');
      case 'Exportar Carteira':
        return handleShareXLS();
      case 'Modo Escuro':
        return setSelectTheme(name === 'LIGHT' ? 'DARK' : 'LIGHT');
      case 'Ajuda':
        return setOpenModal('Help');
      case 'Versão do APP - v2.3.0':
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
              <MaterialDesignIcons
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
