import React, { useMemo } from 'react';
import Styled from 'styled-components';
import { Bar } from 'react-chartjs-2';

export default function 차트 ({ data, max }) {
  if (!data) return null;

  const options = useMemo(() => ({
    indexAxis: 'y',
    responsive: true,
    ticks: {
      stepSize: 5,
    },
    scales: {
      x: {
        min: 0,
        max: max,
      },
    }
  }), []);

  return (
    <Wrap>
      <Bar data={data} options={options} height={250} />
    </Wrap>
  )
}

const Wrap = Styled.div`
  width: 100%;
  /* height: 42vw; */
  max-width: 500px;
  /* max-height: 300px; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888888aa;
  margin: 0 auto 10px;
`;