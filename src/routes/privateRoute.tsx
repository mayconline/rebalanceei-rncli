import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Feather, FontAwesome } from '../services/icons';

import AddButton from '../components/AddButton';

import Ticket from '../pages/Ticket';
import Rebalance from '../pages/Rebalance';

import Rentability from '../pages/Rentability';
import Chart from '../pages/Chart';
import { useModalStore } from '../store/useModalStore';
import AddTicketModal from '../modals/AddTicketModal';
import { useNavigation } from '@react-navigation/native';

interface labelProps {
  focused: boolean;
  color: string;
}

const Label = styled.Text<labelProps>`
  color: ${({ color }) => color};
  position: relative;
  padding-bottom: 4px;
  border-bottom-width: ${({ focused }) => (focused ? '4px' : 0)};
  border-bottom-color: ${({ color }) => color};
  font: 600 12px/14px 'TitilliumWeb-SemiBold';
  font-smooth: 'antialiased';
  text-align: center;
  width: 100%;
  align-self: center;
  margin-top: 4px;
`;

const Tab = createBottomTabNavigator();

interface propIcons {
  lib: any;
  name: string;
  title: string;
}

type Icons = {
  [key: string]: propIcons;
};

const icons: Icons = {
  Ticket: {
    lib: Entypo,
    name: 'wallet',
    title: 'Ativos',
  },
  Rebalance: {
    lib: Feather,
    name: 'trending-up',
    title: 'Rebalancear',
  },
  Rentability: {
    lib: Feather,
    name: 'activity',
    title: 'Variação',
  },
  Chart: {
    lib: FontAwesome,
    name: 'pie-chart',
    title: 'Gráficos',
  },
};

const privateRoute = () => {
  const { color } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { openModal, modalType } = useModalStore(
    ({ openModal, modalType }) => ({ openModal, modalType })
  );

  const handleClickAddTicket = () => {
    navigation.navigate('Ticket');
    openModal('AddTicket');
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'AddTicket') {
            return (
              <AddButton
                onPress={handleClickAddTicket}
                focused={focused}
                size={64}
                mb={64}
              />
            );
          }

          const { lib: Icon, name } = icons[route.name];
          return <Icon name={name} size={size} color={color} />;
        },
        tabBarLabel: ({ color, focused }) => {
          if (route.name === 'AddTicket') {
            return null;
          }

          const { title } = icons[route.name];

          return (
            <Label color={color} focused={focused}>
              {title}
            </Label>
          );
        },
        tabBarHideOnKeyboard: true,
        keyboardHidesTabBar: true,
        tabBarActiveTintColor: color.activeMenuItem,
        tabBarInactiveTintColor: color.inactiveMenuItem,
        tabBarItemStyle: {
          backgroundColor: color.bgTabMenu,
          paddingVertical: 8,
          borderTopLeftRadius: route.name === 'Ticket' ? 24 : 0,
          borderTopRightRadius: route.name === 'Chart' ? 24 : 0,
          borderTopColor: color.borderTabMenu,
          borderLeftColor:
            route.name === 'Ticket' ? color.borderTabMenu : color.bgTabMenu,
          borderRightColor:
            route.name === 'Chart' ? color.borderTabMenu : color.bgTabMenu,
          borderWidth: 1,
          marginHorizontal: -1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: [
          {
            display: !modalType ? 'flex' : 'none',
            height: 84 + insets.bottom,
            backgroundColor: color.bgHeaderEmpty,
            borderTopColor: color.bgHeaderEmpty,
            borderTopWidth: 0,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: insets.bottom,
          },
          null,
        ],
        headerShown: false,
        animation: 'shift',
      })}
    >
      <Tab.Screen
        name="Ticket"
        component={Ticket}
        options={{
          title: 'Ativos',
        }}
      />
      <Tab.Screen
        name="Rebalance"
        component={Rebalance}
        options={{
          title: 'Rebalancear',
        }}
      />
      <Tab.Screen
        name="AddTicket"
        component={AddTicketModal}
        options={{
          title: '',
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
          },
        })}
      />
      <Tab.Screen
        name="Rentability"
        component={Rentability}
        options={{
          title: 'Variação',
        }}
      />
      <Tab.Screen
        name="Chart"
        component={Chart}
        options={{
          title: 'Gráficos',
        }}
      />
    </Tab.Navigator>
  );
};
export default privateRoute;
