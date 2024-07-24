import React, { useContext, useState, useCallback } from 'react';
import { Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';

import { useLazyQuery, gql } from '@apollo/client';
import { useAuth } from '../../contexts/authContext';
import {
  Wrapper,
  Title,
  AddWalletContainer,
  Label,
  BackIcon,
  AddButtonContainer,
  TitleContainer,
} from './styles';

import AddButton from '../../components/AddButton';

import TextError from '../../components/TextError';
import AddWalletModal from '../AddWalletModal';
import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';
import { formatNumber } from '../../utils/format';
import useAmplitude from '../../hooks/useAmplitude';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IWalletProps {
  onClose(): void;
}

export interface IObjectWallet {
  _id: string;
  description: string;
  sumCostWallet: number;
  sumAmountWallet: number;
  percentRentabilityWallet: number;
  percentPositionWallet: number;
  sumAmountAllWallet: number;
}

interface IDataWallet {
  getWalletByUser: IObjectWallet[];
}

export interface IWalletData {
  _id: string;
  description: string;
}

const WalletModal = ({ onClose }: IWalletProps) => {
  const { logEvent } = useAmplitude();

  const { color } = useContext(ThemeContext);
  const { handleSetWallet, wallet, handleSetLoading } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [editWallet, setEditWallet] = useState<IWalletData>({} as IWalletData);
  const [selectedWallet, setSelectedWallet] = useState<String | null>(wallet);

  useFocusEffect(
    useCallback(() => {
      logEvent('open Wallet Modal');
    }, []),
  );

  const [getWalletByUser, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<IDataWallet>(GET_WALLET_BY_USER, {
      fetchPolicy: 'cache-first',
    });

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(queryLoading);
    }, [queryLoading]),
  );

  useFocusEffect(
    useCallback(() => {
      !data?.getWalletByUser && getWalletByUser();
    }, [data?.getWalletByUser]),
  );

  const handleSelectWallet = useCallback(
    (walletID: string, walletName: string) => {
      handleSetWallet(walletID, walletName);
      setSelectedWallet(walletID);

      logEvent('click on select wallet');
      onClose();
    },
    [],
  );

  const handleAddWallet = useCallback(() => {
    setOpenModal(openModal => !openModal);
    logEvent('click on add wallet');
  }, []);

  const handleEditWallet = useCallback((_id: string, description: string) => {
    setEditWallet({ _id, description });
    setOpenModal(openModal => !openModal);
    logEvent('click on edit wallet');
  }, []);

  const handleResetEditWallet = useCallback(() => {
    setEditWallet({} as IWalletData);
  }, []);

  return (
    <>
      <Wrapper>
        <TitleContainer>
          <Title accessibilityRole="header">Carteiras</Title>
          <BackIcon
            accessibilityRole="imagebutton"
            accessibilityLabel="Voltar"
            onPress={onClose}
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={color.closeIcon}
            />
          </BackIcon>
        </TitleContainer>

        <ListTicket
          data={data?.getWalletByUser}
          extraData={!!queryLoading}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              handleSelectWallet={handleSelectWallet}
              selectedWallet={selectedWallet}
              handleEditWallet={handleEditWallet}
            />
          )}
          ListFooterComponent={
            <>
              <Title
                accessibilityRole="summary"
                accessibilityLabel="Valor total somado das carteiras"
                accessibilityValue={{
                  now: data?.getWalletByUser[0]?.sumAmountAllWallet,
                }}
              >
                Total:{' '}
                {formatNumber(data?.getWalletByUser[0]?.sumAmountAllWallet)}
              </Title>
              <Title>
                {!!data?.getWalletByUser?.length
                  ? `${data?.getWalletByUser?.length} Itens`
                  : 'Adicione uma Carteira clicando no botão abaixo.'}
              </Title>
            </>
          }
          ListFooterComponentStyle={{ marginTop: 16 }}
        />
        {!!queryError && <TextError>{queryError?.message}</TextError>}

        <AddWalletContainer>
          <AddButtonContainer onPress={() => handleAddWallet()}>
            <Label accessibilityRole="button">Adicionar Carteira</Label>
            <AddButton size={40} onPress={() => handleAddWallet()} />
          </AddButtonContainer>
        </AddWalletContainer>
      </Wrapper>

      {openModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          statusBarTranslucent={true}
        >
          <AddWalletModal
            onClose={handleAddWallet}
            walletData={editWallet}
            handleResetEditWallet={handleResetEditWallet}
          />
        </Modal>
      )}
    </>
  );
};

export const GET_WALLET_BY_USER = gql`
  query getWalletByUser {
    getWalletByUser {
      _id
      description
      sumCostWallet
      sumAmountWallet
      percentRentabilityWallet
      percentPositionWallet
      sumAmountAllWallet
    }
  }
`;

export default WalletModal;
