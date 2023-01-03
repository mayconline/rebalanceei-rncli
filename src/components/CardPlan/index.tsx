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
  <Wrapper currentPlan={currentPlan} active={active} {...rest}>
    <CardPlanHeaderGroup>
      <CardPlanTitle>{title}</CardPlanTitle>
      {!currentPlan && <PlanRadioSelect selected={active} />}
    </CardPlanHeaderGroup>

    <CardPlanGroup>
      <CardPlanContainerDescription>
        {descriptions?.map((description, index) => (
          <CardPlanDescription key={index}>{description}</CardPlanDescription>
        ))}
      </CardPlanContainerDescription>
      <CardPlanRole>{plan}</CardPlanRole>
    </CardPlanGroup>
  </Wrapper>
);

export default React.memo(CardPlan);
