import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { css } from 'styled-components';

export interface RadioProps {
  selected?: boolean;
}

export interface IPercentVariation {
  value: number;
}

export const Wrapper = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.color.bgModalPrimary};
  padding: 20px 0 8px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  height: 300px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  elevation: 5;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 4px 28px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.color.titleNotImport};
  font: 600 18px/20px 'TitilliumWeb-SemiBold';
  text-align: center;
  margin: 8px;
  flex: 1;
  font-smooth: antialiased;
`;

export const Card = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-left: 8px;
`;
export const CardTitleContainer = styled.View`
  flex-direction: column;
  flex: 1;
`;
export const WalletTitle = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  max-width: 80%;
  font-smooth: antialiased;
`;
export const CardSubTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const CurrentAmount = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 400 14px/24px 'TitilliumWeb-Regular';
  opacity: 0.5;
  font-smooth: antialiased;
`;
export const VariationPercent = styled.Text<IPercentVariation>`
  color: ${({ theme, value }) =>
    value > 0
      ? theme.color.success
      : value < 0
      ? theme.color.danger
      : theme.color.titleItemCard};
  font: 600 14px/24px 'TitilliumWeb-SemiBold';
  margin-left: 8px;
  font-smooth: antialiased;
`;
export const PercentWallet = styled.View`
  flex-direction: column;
  margin-right: 16px;
`;
export const PercentTitle = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  font-smooth: antialiased;
`;
export const CurrentPercent = styled.Text`
  color: ${({ theme }) => theme.color.titleItemCard};
  font: 400 16px/24px 'TitilliumWeb-Regular';
  align-self: flex-end;
  opacity: 0.5;
  font-smooth: antialiased;
`;
export const AddWalletContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 20px;
`;
export const Label = styled.Text`
  color: ${({ theme }) => theme.color.title};
  font: 600 16px/24px 'TitilliumWeb-SemiBold';
  padding: 8px;
  font-smooth: antialiased;
`;

export const AddButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
`;

export const BackIcon = styled.TouchableOpacity``;

export const WalletRadioSelect = styled.View<RadioProps>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  border: ${({ selected }) => (selected ? '6px' : '2px')} solid
    ${({ theme }) => theme.color.selectedRadio};
  background-color: ${({ theme }) => theme.color.bgRadio};
`;
