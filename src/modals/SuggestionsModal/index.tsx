import React, { useState, useContext, useCallback } from 'react';
import { ThemeContext } from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import {
  SuggestionContainer,
  SuggestionList,
  SuggestionItem,
  SuggestionText,
  SuggestionButton,
  SuggestionError,
  BackButton,
  BackButtonContainer,
} from './styles';
import api from '../../services/api';
import { useDebouncedCallback } from 'use-debounce';
import ShadowBackdrop from '../../components/ShadowBackdrop';
import InputForm from '../../components/InputForm';
import useAmplitude from '../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';

interface ISuggestions {
  symbol: string;
  longname: string;
  shortname: string;
}

interface ISuggestionsProps {
  onClose(): void;
  handleSelectTicket(symbol: string, name: string): void;
}

const SuggestionsModal: React.FC<ISuggestionsProps> = ({
  onClose,
  handleSelectTicket,
}) => {
  const { logEvent } = useAmplitude();
  const { color } = useContext(ThemeContext);
  const [suggestions, setSuggestions] = useState<ISuggestions[] | null>([]);
  const [selectTicket, setSelectTicket] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      logEvent('open Suggestion Modal');
    }, []),
  );

  const handleSuggestionsAutoComplete = useCallback((ticket: string) => {
    setLoading(true);
    setSelectTicket(ticket);

    logEvent('open suggestion list at Suggestion Modal');

    displaySuggestionsAutoComplete.callback(ticket);
  }, []);

  const displaySuggestionsAutoComplete = useDebouncedCallback(
    async (ticket: string) => {
      try {
        const response = await api.get('/search?', {
          params: {
            q: ticket,
          },
        });

        let suggest = response?.data?.quotes;

        if (!suggest.length) {
          setLoading(false);
          setError(true);
        }

        setSuggestions(suggest);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    },
    300,
  );

  const handleSelectSuggest = useCallback((symbol: string, name: string) => {
    handleSelectTicket(symbol, name);
    logEvent('click on selected ticket at Suggestion Modal');
    onClose();
  }, []);

  return (
    <>
      <ShadowBackdrop />
      <SuggestionContainer>
        <InputForm
          label="Pesquise e Selecione um Ativo"
          value={selectTicket}
          placeholder="RBLC3"
          maxLength={10}
          autoFocus
          onChangeText={ticket => handleSuggestionsAutoComplete(ticket)}
          autoCapitalize={'characters'}
        />

        {loading ? (
          <ActivityIndicator size="large" color={color.titleNotImport} />
        ) : !!suggestions?.length ? (
          <SuggestionList>
            {suggestions?.map(suggestion => (
              <SuggestionItem key={suggestion.symbol}>
                <SuggestionButton
                  onPress={() =>
                    handleSelectSuggest(
                      suggestion?.symbol,
                      !!suggestion?.longname
                        ? suggestion?.longname
                        : suggestion?.shortname,
                    )
                  }
                >
                  <SuggestionText
                    accessibilityRole="button"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {suggestion.symbol}- {suggestion.longname}
                  </SuggestionText>
                </SuggestionButton>
              </SuggestionItem>
            ))}
          </SuggestionList>
        ) : (
          error && (
            <SuggestionError numberOfLines={1} ellipsizeMode="tail">
              Ativo não encontrado
            </SuggestionError>
          )
        )}

        <BackButtonContainer onPress={() => onClose()}>
          <BackButton>Fechar</BackButton>
        </BackButtonContainer>
      </SuggestionContainer>
    </>
  );
};

export default SuggestionsModal;
