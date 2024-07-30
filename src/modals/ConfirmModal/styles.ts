import styled from 'styled-components/native';

interface IContainerButtonsProps {
  isOnlyConfirm?: boolean;
}

export const WrapperConfirmModal = styled.View`
  background-color: ${({ theme }) => theme.color.secondary};
  elevation: 5;
  margin: auto 12%;
  padding: 8%;
  border-radius: 10px;
`;

export const DescriptionConfirmModal = styled.Text`
  color: ${({ theme }) => theme.color.menuIconColor};
  font: 400 22px 'TitilliumWeb-Regular';
  font-smooth: 'antialiased';
  text-align: center;
  margin-bottom: 16%;
`;

export const LegendConfirmModal = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 400 16px 'TitilliumWeb-Regular';
  font-smooth: 'antialiased';
  text-align: center;
  margin-bottom: 12%;
  margin-top: -8%;
`;

export const ContainerButtons = styled.View<IContainerButtonsProps>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ isOnlyConfirm }) =>
    isOnlyConfirm ? 'center' : 'space-between'};
`;
