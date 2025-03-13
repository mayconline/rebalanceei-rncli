import styled from 'styled-components/native';

export const ContainerYearFilter = styled.View`
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  margin: 0 auto -52px;
`;

export const YearContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: -4px;
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
  margin: -4px 0;
  font-smooth: 'antialiased';
`;

export const YearButton = styled.Pressable`
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  padding: 24px;
`;
