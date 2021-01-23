import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 20px 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export const ContainerTitle = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 20px/28px 'TitilliumWeb-SemiBold';
  align-self: center;
`;

export const LootieContainer = styled.View`
  min-height: 500px;
`;
