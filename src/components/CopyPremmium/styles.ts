import styled from 'styled-components/native';

export const ContainerPremmium = styled.View`
  margin-top: 12px;
`;

export const ContainerPremmiumGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 8px;
  margin: 8px;
`;

export const ContainerDescription = styled.View``;

export const Description = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  font-smooth: 'antialiased';
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 36px/48px 'TitilliumWeb-SemiBold';
  text-align: center;
  font-smooth: 'antialiased';
`;
