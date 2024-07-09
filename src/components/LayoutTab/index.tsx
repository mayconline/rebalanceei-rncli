import { ApolloError } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import React, { memo, useCallback, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../contexts/authContext';
import useAmplitude from '../../hooks/useAmplitude';
import Empty from '../Empty';
import Header from '../Header';
import SubHeader from '../SubHeader';
import YearFilter from '../YearFilter';

const fatalErrors = [
  'Error: Token Not Exists',
  'Error: Refresh Token Invalid or Expired',
];

interface LayoutTabProps {
  children?: any;
  title: string;
  routeName: string;
  queryLoading: boolean;
  queryError?: ApolloError;
  hasEmptyTickets?: boolean;
  initialFilter: any[];
  count: number;
  selectedFilter: string;
  handleChangeFilter: (filterName: string) => void;
  menuTitles?: string[];
  handleChangeMenu?: (menu: 'Carteira' | 'Proventos') => void;
  selectedMenu?: string;
  currentYear?: number;
  setCurrentYear?: React.Dispatch<React.SetStateAction<number>>;
}

const LayoutTab = ({
  children,
  title,
  routeName,
  queryLoading,
  queryError,
  hasEmptyTickets,
  initialFilter,
  count,
  selectedFilter,
  handleChangeFilter,
  menuTitles,
  handleChangeMenu,
  selectedMenu,
  currentYear,
  setCurrentYear,
}: LayoutTabProps) => {
  const { color } = useContext(ThemeContext);
  const { logEvent } = useAmplitude();
  const { handleSetLoading, handleSignOut } = useAuth();

  useFocusEffect(
    useCallback(() => {
      logEvent(`open ${routeName}`);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(queryLoading);
    }, [queryLoading]),
  );

  useFocusEffect(
    useCallback(() => {
      fatalErrors.includes(String(queryError)) && handleSignOut();
    }, [queryError]),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bgHeaderEmpty }}>
      <Header />

      {hasEmptyTickets ? (
        <Empty errorMessage={queryError?.message} />
      ) : (
        <>
          <SubHeader
            title={title}
            count={count}
            filters={initialFilter}
            selectedFilter={selectedFilter}
            onPress={handleChangeFilter}
            menuTitles={menuTitles}
            handleChangeMenu={handleChangeMenu}
            selectedMenu={selectedMenu}
          >
            {routeName === 'Earning' && (
              <YearFilter
                currentYear={currentYear!}
                setCurrentYear={setCurrentYear!}
                isAccumulated={selectedFilter === 'accumulated'}
              />
            )}
          </SubHeader>
          {children}
        </>
      )}
    </SafeAreaView>
  );
};

export default memo(LayoutTab);
