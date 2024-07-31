import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SuggestionContainer = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  min-height: 380px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  elevation: 5;
`;

export const SuggestionList = styled.ScrollView`
  margin-top: 4px;
  elevation: 0.6;
  border-color: ${({ theme }) => theme.color.divider};
  border-width: 0.7px;
  border-radius: 4px;
  max-height: 160px;
  background-color: ${({ theme }) => theme.color.bgCardPlan};
`;

export const SuggestionItem = styled.View`
  border-bottom-color: ${({ theme }) => theme.color.divider};
  border-bottom-width: 0.7px;
  border-radius: 4px;
`;

export const SuggestionButton = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 4px;
`;

export const SuggestionText = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  font-smooth: 'antialiased';
`;

export const BackButtonContainer = styled.TouchableOpacity`
  align-items: center;
  padding: 12px;
  border-radius: 4px;
`;

export const BackButton = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 600 20px/28px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
`;

export const SuggestionError = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
`;
