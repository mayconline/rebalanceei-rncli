import styled from 'styled-components/native';

export const List = styled.SafeAreaView`
  flex: 1;
`;

export const Image = styled.View`
  height: 180px;
  padding: 16px;
`;

export const TextLink = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  font-smooth: 'antialiased';
`;

export const ContainerTitle = styled.View`
  align-items: center;
`;
