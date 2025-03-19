import React from 'react';
import { render } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider } from 'styled-components/native';
import themes from '../themes';
import type { DocumentNode, GraphQLError } from 'graphql';
import {
  NavigationContext,
  NavigationRouteContext,
} from '@react-navigation/native';
import * as modalStore from '../store/useModalStore';

interface IMocks {
  request: {
    query: DocumentNode;
    variables?: Record<string, unknown>;
  };
  result: {
    data?: Record<string, unknown>;
    errors?: GraphQLError[];
  };
}

export const testProvider = (
  children: JSX.Element,
  mocks: Array<IMocks> = [],
  params?: object,
) => {
  const mockOpenModal = jest.fn();
  const mockOpenConfirmModal = jest.fn();
  jest.spyOn(modalStore, 'useModalStore').mockImplementation(() => ({
    openModal: mockOpenModal,
    openConfirmModal: mockOpenConfirmModal,
    setLoading: jest.fn(),
  }));

  const setParams = jest.fn(jest.fn());
  const navigate = jest.fn(jest.fn());
  const goBack = jest.fn(jest.fn);

  const mockNavContext: any = {
    isFocused: () => true,
    addListener: jest.fn(() => jest.fn()),
  };

  const renderUtils = render(
    <MockedProvider mocks={mocks}>
      <ThemeProvider theme={themes.light}>
        <NavigationContext.Provider
          value={{ setParams, navigate, goBack, ...mockNavContext }}
        >
          <NavigationRouteContext.Provider
            value={{ params, key: 'mocked_key', name: 'mocked_name' }}
          >
            {children}
          </NavigationRouteContext.Provider>
        </NavigationContext.Provider>
      </ThemeProvider>
    </MockedProvider>,
  );

  return {
    ...renderUtils,
    setParams,
    navigate,
    goBack,
    mockOpenModal,
    mockOpenConfirmModal,
  };
};

export * from '@testing-library/react-native';
export { testProvider as render };
