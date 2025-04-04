import React, { Fragment, useState, useCallback } from 'react';
import { PieChart, PieChartData } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';
import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';

import {
  Content,
  ContainerGraph,
  ContainerList,
  ContainerLegend,
  LegendList,
  TextList,
} from './styles';

import { formatTicket } from '../../utils/format';

import AdBanner from '../../components/AdBanner';
import useAmplitude from '../../hooks/useAmplitude';
import ListTicket from '../../components/ListTicket';
import LayoutTab from '../../components/LayoutTab';

const initialFilter = [
  {
    name: 'TICKET',
  },
  {
    name: 'CLASS',
  },
  {
    name: 'INDUSTRY',
  },
  {
    name: 'SECTOR',
  },
];
interface IReports {
  _id: string;
  key: string;
  value: number;
  color: string;
}

interface IDataReports {
  getReportsByType: IReports[];
}

const Chart = () => {
  const { logEvent } = useAmplitude();
  const [dataGraph, setDataGraph] = useState<PieChartData[]>([]);
  const [selectedFilter, setSelectFilter] = useState<string>('CLASS');

  const { wallet } = useAuth();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Chart');
    }, []),
  );

  const [getReportsByType, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<IDataReports>(GET_REPORTS_BY_TYPE, {
      variables: { walletID: wallet, type: selectedFilter },
      fetchPolicy: 'cache-and-network',
    });

  useFocusEffect(
    useCallback(() => {
      getReportsByType();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (data?.getReportsByType) {
        const formatedPie: PieChartData[] = data?.getReportsByType?.map(
          item => ({
            value: Number(item.value.toFixed(1)),
            svg: {
              fill: item.color,
            },
            key: formatTicket(item.key),
            arc: {
              outerRadius: '100%',
              cornerRadius: 4,
              padAngle: 0.01,
            },
          }),
        );

        return setDataGraph(formatedPie);
      }
    }, [data, selectedFilter]),
  );

  const Labels = ({ slices }: { slices?: any }) => {
    return slices?.map((slice: any) => {
      const { pieCentroid, data } = slice;
      return (
        <Fragment key={data.key}>
          <Text
            x={pieCentroid[0]}
            y={pieCentroid[1]}
            fill={'white'}
            textAnchor={'middle'}
            alignmentBaseline={'after-edge'}
            fontSize={12}
            stroke={'black'}
            strokeWidth={0.1}
          >
            {`${data.value}%`}
          </Text>
          <Text
            x={pieCentroid[0]}
            y={pieCentroid[1]}
            fill={'white'}
            textAnchor={'middle'}
            alignmentBaseline={'top'}
            fontSize={12}
            stroke={'black'}
            strokeWidth={0.1}
          >
            {data.key}
          </Text>
        </Fragment>
      );
    });
  };

  const handleChangeFilter = useCallback((filterName: string) => {
    setSelectFilter(filterName);
  }, []);

  const hasEmptyTickets =
    !wallet || (!queryLoading && data?.getReportsByType?.length === 0);

  return (
    <LayoutTab
      title="Gráficos"
      routeName="Chart"
      count={dataGraph.length}
      initialFilter={initialFilter}
      selectedFilter={selectedFilter}
      handleChangeFilter={handleChangeFilter}
      hasEmptyTickets={hasEmptyTickets}
      queryError={queryError}
      queryLoading={queryLoading}
      showCount
    >
      <Content>
        <ContainerGraph>
          <PieChart
            style={{ flex: 1 }}
            data={dataGraph}
            valueAccessor={({ item }: { item?: any }) => item.value}
            outerRadius={'92%'}
            innerRadius={'48%'}
          >
            <Labels />
          </PieChart>
        </ContainerGraph>

        <AdBanner />

        <ListTicket
          data={dataGraph}
          extraData={dataGraph}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <ContainerList key={item.key}>
              <ContainerLegend>
                <LegendList color={item.svg.fill} />
                <TextList>{item.key}</TextList>
              </ContainerLegend>

              <TextList>{`${item.value.toFixed(1)}%`}</TextList>
            </ContainerList>
          )}
        />
      </Content>
    </LayoutTab>
  );
};

export const GET_REPORTS_BY_TYPE = gql`
  query getReportsByType($walletID: ID!, $type: Type!) {
    getReportsByType(walletID: $walletID, type: $type) {
      _id
      key
      value
      color
    }
  }
`;

export default Chart;
