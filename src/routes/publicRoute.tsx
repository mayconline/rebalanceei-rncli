import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Welcome from '../pages/public/Welcome';
import SignUp from '../pages/public/SignUp';
import Login from '../pages/public/Login';
import ForgotPassword from '../pages/public/ForgotPassword';
import ChangePassword from '../pages/public/ChangePassword';
import StepOne from '../pages/public/Onboarding/StepOne';
import StepTwo from '../pages/public/Onboarding/StepTwo';
import StepThree from '../pages/public/Onboarding/StepThree';

const Stack = createStackNavigator();

const publicRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="StepOne" component={StepOne} />
      <Stack.Screen name="StepTwo" component={StepTwo} />
      <Stack.Screen name="StepThree" component={StepThree} />
    </Stack.Navigator>
  );
};

export default publicRoute;
