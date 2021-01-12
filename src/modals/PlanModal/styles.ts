import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.color.primary};
`;

export const Container = styled.View`
  background-color: ${({ theme }) => theme.color.secondary};
  padding: 20px 20px 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  min-height: 600px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  elevation: 5;
`;

export const ContainerTitle = styled.View`
  margin-top: 16px;
  flex-direction: row;
  justify-content: space-between;
`;

export const BackIcon = styled.TouchableOpacity`
  padding-right: 8px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 20px/24px 'TitilliumWeb-SemiBold';
  text-align: center;
  flex: 1;
`;

export const SubTitle = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 36px/48px 'TitilliumWeb-SemiBold';
  text-align: center;
  flex: 1;
`;

export const CardPlan = styled.View`
  margin: 24px 0;
  border-color: ${({ theme }) => theme.color.success};
  border-width: 2px;
  border-radius: 12px;
  elevation: 2;
`;

export const CardPlanTitle = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  margin: 12px 24px 0;
`;

export const CardPlanGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 8px;
  margin: 8px;
`;

export const CardPlanContainerDescription = styled.View``;

export const CardPlanDescription = styled.Text`
  color: ${({ theme }) => theme.color.subtitle};
  font: 400 16px/24px 'TitilliumWeb-Regular';
`;

export const CardPlanRole = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 400 16px/24px 'TitilliumWeb-Regular';
`;

export const ContainerButtons = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 80px;
`;

export const ContainerPremmium = styled.View`
  margin-top: 24px;
`;

export const ContainerPremmiumGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 8px;
  margin: 8px;
`;
