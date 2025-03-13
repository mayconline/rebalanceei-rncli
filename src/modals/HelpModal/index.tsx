import React, { useContext, useCallback } from 'react';
import { ThemeContext } from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/native';
import { useLazyQuery, gql } from '@apollo/client';
import {
  Wrapper,
  Image,
  ContainerTitle,
  Title,
  BackIcon,
  Container,
  Question,
} from './styles';

import Collapse from '../../components/Collapse';
import ListTicket from '../../components/ListTicket';
import ImageHelp from '../../../assets/svg/ImageHelp';
import TextError from '../../components/TextError';
import useAmplitude from '../../hooks/useAmplitude';
import { useAuth } from '../../contexts/authContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IHelpModal {
  onClose(): void;
}

interface IQuestion {
  _id: string;
  ask: string;
  answer: string;
}

interface IGetQuestion {
  questions: IQuestion[];
}

const HelpModal = ({ onClose }: IHelpModal) => {
  const { logEvent } = useAmplitude();
  const { color } = useContext(ThemeContext);
  const { handleSetLoading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Help Modal');
    }, []),
  );

  const [questions, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<IGetQuestion>(GET_QUESTIONS);

  useFocusEffect(
    useCallback(() => {
      questions();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(queryLoading);
    }, [queryLoading]),
  );

  return (
    <Wrapper>
      <ContainerTitle>
        <Title accessibilityRole="header">Ajuda</Title>
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
      </ContainerTitle>
      <Image>
        <ImageHelp />
      </Image>
      <Container>
        {!!queryError && <TextError>{queryError?.message}</TextError>}
        <ListTicket
          data={data?.questions}
          keyExtractor={item => item._id}
          ListFooterComponent={
            <Collapse title="Sua duvida não foi respondida ?">
              <Question>
                Entre em contato conosco atraves do e-mail
                rebalanceeiapp@gmail.com
              </Question>
            </Collapse>
          }
          renderItem={({ item }) => (
            <Collapse title={item.ask}>
              <Question>{item.answer}</Question>
            </Collapse>
          )}
        />
      </Container>
    </Wrapper>
  );
};

export const GET_QUESTIONS = gql`
  query questions {
    questions {
      _id
      ask
      answer
    }
  }
`;

export default React.memo(HelpModal);
