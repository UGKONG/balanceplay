import React, { useMemo } from 'react';
import Styled from 'styled-components';
import Chart from './Chart';

export default function 결과차트 ({ data }) {

  const chartData = useMemo(() => ({
    labels: data?.map(x => x?.NAME),
    datasets: [{
      data: data?.map(x => x?.POINT),
      backgroundColor: '#00ada950',
      borderColor: '#00ada990',
      borderWidth: 1,
    }]
  }), [data]);
  const lastMaxPoint = useMemo(() => {
    let tempArr = [...data];
    tempArr?.sort((a, b) => b?.POINT - a?.POINT);
    let result = tempArr[0]?.POINT;
    console.log(result);
    return result;
  }, [data]);
  
  return (
    <Container>
      <Chart data={chartData} max={lastMaxPoint} />
    </Container>
  )
}

const Container = Styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`