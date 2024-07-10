import styled from 'styled-components/native';

export const Content = styled.View`
  flex: 0;
`;

export const ContainerCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.color.bgItemCard};
  border-radius: 12px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.color.borderItemCard};
  margin-bottom: 8px;
`;
