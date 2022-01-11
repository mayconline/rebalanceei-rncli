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
}

const YearFilter = ({ currentYear, setCurrentYear }: IYearFilter) => {
  const { color } = useContext(ThemeContext);

  return (
    <ContainerYearFilter>
      <Pressable
        onPress={() => setCurrentYear(current => current - 1)}
        accessibilityRole="button"
        accessibilityLabel="Ano Anterior"
      >
        <MaterialCommunityIcons
          name="chevron-left-circle"
          size={32}
          color={color.blue}
        />
      </Pressable>

      <YearContainer>
        <YearText
          accessibilityLabel="Ano Selecionado"
          accessibilityValue={{
            now: currentYear,
          }}
        >
          {currentYear}
        </YearText>
        <YearSubtitle>Ano selecionado</YearSubtitle>
      </YearContainer>

      <Pressable
        onPress={() => setCurrentYear(current => current + 1)}
        accessibilityRole="button"
        accessibilityLabel="Próximo Ano"
      >
        <MaterialCommunityIcons
          name="chevron-right-circle"
          size={32}
          color={color.blue}
        />
      </Pressable>
    </ContainerYearFilter>
  );
};

export default React.memo(YearFilter);
