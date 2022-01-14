import styled from 'styled-components/native';

interface ILegendList {
  color: string;
}

export const Content = styled.View`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 0 12px;
  flex: 1;
`;

export const ContainerGraph = styled.View`
  flex: 1 1 auto;
  height: 160px;
`;

export const ContainerList = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 4px;
  margin-top: 4px;
`;

export const ContainerLegend = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const LegendList = styled.View<ILegendList>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  margin: 0 8px 2px 4px;
`;

export const TextList = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 16px/20px 'TitilliumWeb-Regular';
`;
