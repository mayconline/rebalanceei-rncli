import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  margin: 8px 0;
  flex: 0;
  border: 1px solid ${({ theme }) => theme.color.success};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.bgItemCard};
`;

export const Header = styled.TouchableOpacity`
  padding: 8px 12px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
`;

export const Body = styled.View`
  padding: 8px 12px;
`;
