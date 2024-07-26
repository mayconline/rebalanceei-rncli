import styled from 'styled-components/native';

export const ContainerYearFilter = styled.View`
  align-items: center;
  justify-content: space-evenly;
  padding: 8px;
  margin: 8px 0 0;
  flex-direction: row;
`;

export const YearContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const YearText = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 18px 'TitilliumWeb-Semibold';
  text-align: center;
  font-smooth: 'antialiased';
`;

export const YearSubtitle = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px 'TitilliumWeb-Regular';
  margin: -2px 0;
  font-smooth: 'antialiased';
`;

export const YearButton = styled.Pressable`
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;
