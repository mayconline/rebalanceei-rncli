import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import {
  Wrapper,
  CardPlanGroup,
  CardPlanTitle,
  CardPlanContainerDescription,
  CardPlanDescription,
  CardPlanRole,
  PlanRadioSelect,
  CardPlanHeaderGroup,
} from './styles';
import { colors } from '../../themes/colors';

interface ICardPlan extends TouchableOpacityProps {
  title?: string;
  descriptions?: Array<string>;
  plan?: string;
  currentPlan?: boolean;
  active?: boolean;
}

const CardPlan = ({
  title,
  descriptions,
  plan,
  currentPlan = false,
  active = false,
  ...rest
}: ICardPlan) => (
  <Wrapper
    currentPlan={currentPlan}
    active={active}
    style={colors.shadow.card}
    {...rest}
  >
    <CardPlanHeaderGroup>
      {!currentPlan && <PlanRadioSelect selected={active} />}
    </CardPlanHeaderGroup>

    <CardPlanGroup>
      <CardPlanContainerDescription>
        <CardPlanTitle hasDescriptions={!!descriptions?.length}>
          {title}
        </CardPlanTitle>
        {descriptions?.map((description, index) => (
          <CardPlanDescription key={index}>{description}</CardPlanDescription>
        ))}
      </CardPlanContainerDescription>
      <CardPlanRole>{plan}</CardPlanRole>
    </CardPlanGroup>
  </Wrapper>
);

export default React.memo(CardPlan);
