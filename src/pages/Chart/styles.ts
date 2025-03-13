import styled from 'styled-components/native';

interface ILegendList {
  color: string;
}

export const Content = styled.View`
  background-color: ${({ theme }) => theme.color.bgHeaderEmpty};
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
  padding: 4px 0 0;
`;

export const LegendList = styled.View<ILegendList>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${({ color }) => color};
  margin: 2px 8px 0 0;
`;

export const TextList = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 600 16px 'TitilliumWeb-SemiBold';
  font-smooth: antialiased;
`;
