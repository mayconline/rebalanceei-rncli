import React from 'react';
import PlanModal, { GET_USER_BY_TOKEN } from './index';
import { render, fireEvent, waitFor, act } from '../../utils/testProvider';
import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';

const purchaseListener = jest.spyOn(RNIap, 'purchaseUpdatedListener');
purchaseListener.mockImplementationOnce(jest.fn());

const purchaseErrorListener = jest.spyOn(RNIap, 'purchaseErrorListener');
purchaseErrorListener.mockImplementationOnce(jest.fn());

const mockedOnClose = jest.fn();

describe('PlanModal', () => {
  it('should successfully list current plan and options premium', async () => {
    Platform.OS = 'android';

    const { findByA11yRole } = render(<PlanModal onClose={mockedOnClose} />, [
      SUCCESSFUL_GET_ROLE_USER,
    ]);

    const title = await findByA11yRole('header');
    expect(title).toHaveProperty('children', ['Meu Plano Atual']);
  });
});

const SUCCESSFUL_GET_ROLE_USER = {
  request: {
    query: GET_USER_BY_TOKEN,
  },
  result: {
    data: {
      getUserByToken: {
        _id: 'id_logged',
        role: 'USER',
        __typename: 'User',
      },
    },
  },
};
