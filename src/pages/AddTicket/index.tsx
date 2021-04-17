import React, { useContext, useState, useCallback } from 'react';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { Platform, Modal } from 'react-native';
import { useAuth } from '../../contexts/authContext';
import { ThemeContext } from 'styled-components/native';
import { useMutation, gql } from '@apollo/client';
import {
  Wrapper,
  FormContainer,
  ContainerTitle,
  Title,
  Form,
  FormRow,
  SuggestButton,
  SuggestButtonText,
  BackIcon,
  Image,
  ContainerButtons,
} from './styles';
import ImageAddTicket from '../../../assets/svg/ImageAddTicket';
import SuccessModal from '../../modals/SuccessModal';
import { GET_TICKETS_BY_WALLET } from '../Ticket';
import { GET_WALLET_BY_USER } from '../../modals/WalletModal';
import SuggestionsModal from '../../modals/SuggestionsModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EditTicket from '../../components/EditTicket';
import { ITickets } from '../Ticket';
import Button from '../../components/Button';
import InputForm from '../../components/InputForm';
import TextError from '../../components/TextError';
import {
  formatAveragePricePreview,
  formatTicket,
  openPlanModalOnError,
} from '../../utils/format';
import useAmplitude from '../../hooks/useAmplitude';
import PlanModal from '../../modals/PlanModal';

interface IDataParamsForm {
  ticket: ITickets;
}

interface ITicketForm {
  symbol: string;
  name: string;
  quantity: string;
  averagePrice: string;
  grade: string;
  preview: string;
  averagePreview: string;
}

interface IcreateTicket {
  createTicket: ITickets;
}

const AddTicket = () => {
  const { logEvent } = useAmplitude();
  const { wallet, hasInvalidWallet, handleSetLoading } = useAuth();
  const { color, gradient } = useContext(ThemeContext);

  const [ticketForm, setTicketForm] = useState<ITicketForm>({} as ITicketForm);
  const [focus, setFocus] = useState(0);
  const [hasSuggestions, setHasSuggestions] = useState(false);
  const [openModal, setOpenModal] = useState<'SUCCESS' | 'PLAN' | null>(null);

  const route = useRoute();
  const params = route?.params as IDataParamsForm;
  const navigation = useNavigation();

  const isEdit = !!params?.ticket?._id;

  useFocusEffect(
    useCallback(() => {
      logEvent('open Add Ticket');
    }, []),
  );

  const handleGoBack = useCallback(() => {
    setTicketForm({} as ITicketForm);
    navigation.setParams({ ticket: null });
    navigation.goBack();
  }, []);

  const HandleOpenSuggestionsModal = useCallback(() => {
    if (hasInvalidWallet) return;

    setFocus(1);
    setHasSuggestions(true);
  }, [hasInvalidWallet]);

  const handleSelectTicket = useCallback((symbol: string, name: string) => {
    setTicketForm(ticketForm => ({
      ...ticketForm,
      symbol,
      name,
      preview: symbol,
    }));
    setHasSuggestions(false);
  }, []);

  const [
    createTicket,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<IcreateTicket>(CREATE_TICKET);

  useFocusEffect(
    useCallback(() => {
      mutationLoading && handleSetLoading(true);
    }, [mutationLoading]),
  );

  const handleSubmit = useCallback(async () => {
    if (hasInvalidWallet) {
      logEvent('has invalid wallet at Add Ticket');

      return navigation.navigate('Ticket');
    }

    if (
      !ticketForm.symbol ||
      !ticketForm.name ||
      !ticketForm.quantity ||
      !ticketForm.averagePrice ||
      !ticketForm.grade ||
      !wallet
    ) {
      logEvent('not filled input at Add Ticket');
      return;
    }

    const dataTicket = {
      walletID: wallet,
      symbol: ticketForm.symbol,
      name: ticketForm.name,
      quantity: Number(ticketForm.quantity),
      averagePrice: Number(ticketForm.averagePrice),
      grade: Number(ticketForm.grade),
    };

    try {
      await createTicket({
        variables: dataTicket,
        refetchQueries: [
          {
            query: GET_TICKETS_BY_WALLET,
            variables: { walletID: wallet, sort: 'grade' },
          },
          {
            query: GET_WALLET_BY_USER,
          },
        ],
        awaitRefetchQueries: true,
      });

      logEvent('successful createTicket at Add Ticket');

      setTicketForm({} as ITicketForm);
      setFocus(0);
      setOpenModal('SUCCESS');
    } catch (err) {
      logEvent('error on createTicket at Add Ticket');
      console.error(mutationError?.message + err);

      handleSetLoading(false);

      if (openPlanModalOnError(mutationError?.message)) {
        setOpenModal('PLAN');
        console.log('Tickets limited to 16 items');
      }
    }
  }, [ticketForm, hasInvalidWallet]);

  const handleSetGrade = useCallback((grade: string) => {
    setTicketForm(ticketForm => ({ ...ticketForm, grade }));
  }, []);

  const handleSetQuantity = useCallback((quantity: string) => {
    setTicketForm(ticketForm => ({ ...ticketForm, quantity }));
  }, []);

  const handleSetPrice = useCallback((averagePrice: string) => {
    const { value, preview } = formatAveragePricePreview(averagePrice);

    setTicketForm(ticketForm => ({
      ...ticketForm,
      averagePrice: value,
      averagePreview: preview,
    }));
  }, []);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at Add Ticket`);
    },
    [],
  );

  return (
    <>
      <Wrapper>
        <ContainerTitle>
          <Title accessibilityRole="header">
            {isEdit ? 'Alterar Ativo' : 'Adicionar Ativo'}
          </Title>
          <BackIcon onPress={handleGoBack}>
            <AntDesign name="closecircleo" size={24} color={color.activeText} />
          </BackIcon>
        </ContainerTitle>

        <Image>
          <ImageAddTicket />
        </Image>

        <FormContainer behavior={Platform.OS == 'ios' ? 'padding' : 'position'}>
          {isEdit ? (
            <EditTicket
              ticket={params?.ticket}
              openModal={() => setOpenModal('SUCCESS')}
            />
          ) : (
            <Form>
              <FormRow>
                <SuggestButton onPress={HandleOpenSuggestionsModal}>
                  <MaterialCommunityIcons
                    name="file-document-edit-outline"
                    size={24}
                    color={color.titleNotImport}
                  />
                  <SuggestButtonText accessibilityRole="button">
                    Clique para Buscar e Selecione um Ativo
                  </SuggestButtonText>
                </SuggestButton>
              </FormRow>
              <FormRow>
                <InputForm
                  label="Ativo Selecionado"
                  value={formatTicket(ticketForm.preview)}
                  placeholder="Nenhum ativo selecionado"
                  autoCompleteType="off"
                  maxLength={10}
                  editable={false}
                  width={60}
                />

                <InputForm
                  label="Dê uma Nota"
                  value={ticketForm.grade}
                  placeholder="0 a 100"
                  maxLength={3}
                  keyboardType="number-pad"
                  autoFocus={focus === 2}
                  onFocus={() => setFocus(2)}
                  onChangeText={handleSetGrade}
                  onEndEditing={() => onEndInputEditing(3, 'grade')}
                  width={30}
                />
              </FormRow>

              <FormRow>
                <InputForm
                  label="Preço Médio"
                  value={ticketForm.averagePreview}
                  placeholder="Preço Médio de Compra"
                  keyboardType="number-pad"
                  autoFocus={focus === 3}
                  onFocus={() => setFocus(3)}
                  onChangeText={handleSetPrice}
                  onEndEditing={() => onEndInputEditing(4, 'averagePrice')}
                  width={60}
                />

                <InputForm
                  label="Quantidade"
                  value={ticketForm.quantity}
                  placeholder="9999"
                  keyboardType="number-pad"
                  returnKeyType="send"
                  autoFocus={focus === 4}
                  onFocus={() => setFocus(4)}
                  onChangeText={handleSetQuantity}
                  onEndEditing={() => onEndInputEditing(0, 'quantity')}
                  onSubmitEditing={handleSubmit}
                  width={30}
                />
              </FormRow>

              {!!mutationError?.message && (
                <TextError>{mutationError?.message}</TextError>
              )}

              <ContainerButtons>
                <Button
                  colors={gradient.darkToLightBlue}
                  onPress={handleSubmit}
                  loading={mutationLoading}
                  disabled={mutationLoading}
                >
                  {hasInvalidWallet ? 'Carteira não encontrada' : 'Adicionar'}
                </Button>
              </ContainerButtons>
            </Form>
          )}
        </FormContainer>
      </Wrapper>

      {openModal === 'SUCCESS' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'SUCCESS'}
          statusBarTranslucent={false}
        >
          <SuccessModal
            onClose={() => setOpenModal(null)}
            beforeModalClose={() => navigation.goBack()}
          />
        </Modal>
      )}

      {openModal === 'PLAN' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'PLAN'}
          statusBarTranslucent={true}
        >
          <PlanModal onClose={() => setOpenModal(null)} />
        </Modal>
      )}

      {hasSuggestions && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={hasSuggestions}
          statusBarTranslucent={false}
        >
          <SuggestionsModal
            onClose={() => setHasSuggestions(false)}
            handleSelectTicket={handleSelectTicket}
          />
        </Modal>
      )}
    </>
  );
};

export const CREATE_TICKET = gql`
  mutation createTicket(
    $walletID: ID!
    $symbol: String!
    $name: String!
    $quantity: Float!
    $averagePrice: Float!
    $grade: Int!
  ) {
    createTicket(
      walletID: $walletID
      input: {
        symbol: $symbol
        name: $name
        quantity: $quantity
        averagePrice: $averagePrice
        grade: $grade
      }
    ) {
      _id
      symbol
      quantity
      averagePrice
      grade
      name
    }
  }
`;

export default AddTicket;
