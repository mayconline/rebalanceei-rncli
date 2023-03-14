import React, { Fragment, useCallback, useContext, useState } from 'react';
import { Modal } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useAuth } from '../../contexts/authContext';
import { getTerms } from '../../utils/Terms';
import Divider from '../../components/Divider';
import ShadowBackdrop from '../../components/ShadowBackdrop';
import UpdateUserModal from '../UpdateUserModal';
import HelpModal from '../HelpModal';
import PlanModal from '../PlanModal';

import {
  Wrapper,
  TitleContainer,
  Title,
  BackIcon,
  MenuContainer,
  Menu,
  MenuIcon,
  MenuTitle,
} from './styles';
import { ThemeContext } from 'styled-components/native';
import useAmplitude from '../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';

const menuItens = [
  {
    lib: MaterialCommunityIcons,
    icon: 'face-man-profile',
    description: 'Meus Dados',
  },
  {
    lib: MaterialCommunityIcons,
    icon: 'crown',
    description: 'Meu Plano Atual',
  },
  {
    lib: MaterialCommunityIcons,
    icon: 'shield-check',
    description: 'Termos de Uso',
  },
  {
    lib: FontAwesome,
    icon: 'question-circle',
    description: 'Ajuda',
  },
  {
    lib: Octicons,
    icon: 'versions',
    description: 'Versão do APP - v1.7.12',
  },
  {
    lib: AntDesign,
    icon: 'logout',
    description: 'Sair',
  },
];

interface MenuProps {
  onClose(): void;
}

const MenuModal = ({ onClose }: MenuProps) => {
  const { logEvent } = useAmplitude();

  const { color } = useContext(ThemeContext);
  const { handleSignOut } = useAuth();
  const [openModal, setOpenModal] = useState<'User' | 'Help' | 'Plan' | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      logEvent('open Menu Modal');
    }, []),
  );

  const handleClickMenu = (description: string) => {
    logEvent(`click on ${description} at Menu Modal`);

    switch (description) {
      case 'Meus Dados':
        return setOpenModal('User');
      case 'Meu Plano Atual':
        return setOpenModal('Plan');
      case 'Termos de Uso':
        return getTerms();
      case 'Ajuda':
        return setOpenModal('Help');
      case 'Versão do APP - v1.7.12':
        return;
      case 'Sair':
        return handleSignOut();
      default:
        return;
    }
  };

  return (
    <>
      <ShadowBackdrop />
      <Wrapper>
        <TitleContainer>
          <Title accessibilityRole="header">Menu</Title>
          <BackIcon
            accessibilityRole="imagebutton"
            accessibilityLabel="Voltar"
            onPress={onClose}
          >
            <AntDesign
              name="closecircleo"
              size={24}
              color={color.shadowBackdrop}
            />
          </BackIcon>
        </TitleContainer>

        <MenuContainer accessibilityRole="menu">
          {menuItens?.map(menuItem => {
            const { lib: Icon, icon, description } = menuItem;

            return (
              <Fragment key={description}>
                <Menu
                  onPress={() => {
                    handleClickMenu(description);
                  }}
                  accessibilityRole="menuitem"
                  accessibilityLabel={description}
                >
                  <MenuIcon>
                    <Icon name={icon} size={20} color={color.shadowBackdrop} />
                  </MenuIcon>
                  <MenuTitle>{description}</MenuTitle>
                </Menu>
                <Divider />
              </Fragment>
            );
          })}
        </MenuContainer>
      </Wrapper>

      {openModal === 'User' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'User'}
          statusBarTranslucent={false}
        >
          <UpdateUserModal onClose={() => setOpenModal(null)} />
        </Modal>
      )}

      {openModal === 'Help' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'Help'}
          statusBarTranslucent={true}
        >
          <HelpModal onClose={() => setOpenModal(null)} />
        </Modal>
      )}

      {openModal === 'Plan' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'Plan'}
          statusBarTranslucent={true}
        >
          <PlanModal onClose={() => setOpenModal(null)} />
        </Modal>
      )}
    </>
  );
};

export default MenuModal;
