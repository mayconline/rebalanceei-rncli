import React, { useContext } from 'react';
import { Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from 'styled-components/native';

import {
  ContainerYearFilter,
  YearText,
  YearContainer,
  YearSubtitle,
} from './styles';

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
    <ContainerYearFilter>
      <Pressable
        onPress={() => setCurrentYear(current => current - 1)}
        accessibilityRole="button"
        accessibilityLabel="Ano Anterior"
        disabled={isAccumulated}
      >
        <MaterialCommunityIcons
          name="chevron-left-circle"
          size={32}
          color={isAccumulated ? color.filterDisabled : color.blue}
        />
      </Pressable>

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

      <Pressable
        onPress={() => setCurrentYear(current => current + 1)}
        accessibilityRole="button"
        accessibilityLabel="Próximo Ano"
        disabled={isAccumulated}
      >
        <MaterialCommunityIcons
          name="chevron-right-circle"
          size={32}
          color={isAccumulated ? color.filterDisabled : color.blue}
        />
      </Pressable>
    </ContainerYearFilter>
  );
};

export default React.memo(YearFilter);
