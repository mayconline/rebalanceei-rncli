import React, { useContext } from 'react';
import { Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { ThemeContext } from 'styled-components/native';

import {
  ContainerYearFilter,
  YearText,
  YearContainer,
  YearSubtitle,
  YearButton,
} from './styles';
import Divider from '../Divider';

interface IYearFilter {
  currentYear: number;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  isAccumulated?: boolean;
}

const YearFilter = ({
  currentYear,
  setCurrentYear,
  isAccumulated = false,
}: IYearFilter) => {
  const { color } = useContext(ThemeContext);

  return (
    <>
      <Divider mt={'16px'} />
      <ContainerYearFilter>
        <YearButton
          onPress={() => setCurrentYear(current => current - 1)}
          accessibilityRole="button"
          accessibilityLabel="Ano Anterior"
          disabled={isAccumulated}
        >
          <Feather name="arrow-left-circle" size={24} color={color.title} />
        </YearButton>

        <YearContainer>
          <YearText
            accessibilityLabel="Ano Selecionado"
            accessibilityValue={{
              now: currentYear,
            }}
          >
            {isAccumulated ? 'Todos' : currentYear}
          </YearText>
          <YearSubtitle>Ano selecionado</YearSubtitle>
        </YearContainer>

        <YearButton
          onPress={() => setCurrentYear(current => current + 1)}
          accessibilityRole="button"
          accessibilityLabel="Próximo Ano"
          disabled={isAccumulated}
        >
          <Feather name="arrow-right-circle" size={24} color={color.title} />
        </YearButton>
      </ContainerYearFilter>
    </>
  );
};

export default React.memo(YearFilter);
