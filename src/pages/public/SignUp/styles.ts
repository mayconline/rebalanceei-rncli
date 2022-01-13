import styled from 'styled-components/native';

export const FormRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
`;

export const ContainerTextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

export const TextLink = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  text-align: center;
`;

export const ContainerTerms = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  max-width: 80%;
`;

export const TextTermsLink = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  text-align: center;
`;
