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
  font: 400 16px/20px 'TitilliumWeb-Regular';
  text-align: center;
`;

export const YearSubtitle = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 400 12px/24px 'TitilliumWeb-Regular';
  margin: -8px 0;
`;
