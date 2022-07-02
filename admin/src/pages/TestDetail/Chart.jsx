import React, { useMemo } from 'react';
import Styled from 'styled-components';
import { Radar } from 'react-chartjs-2';

export default function 차트 ({ data, max }) {
  if (!data) return null;

  const options = useMemo(() => ({
    r: {
      angleLines: {
        display: false
      },
      min: 0,
      max: max || 10,
    },
    ticks: {
      stepSize: 5,
      maxTicksLimit: 4
    },
  }), [data]);

  return (
    <Wrap>
      <Radar data={data} options={options} />
    </Wrap>
  )
}

const Wrap = Styled.div`
  width: 100%;
  max-width: 400px;
  max-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888888aa;
  margin: 30px auto 0;
`;