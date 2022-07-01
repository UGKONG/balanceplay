import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import ChartContainer from './ChartContainer';
import ProgressContainer from './ProgressContainer';
import Loading from '@/pages/Common/Loading';

export default function 검사결과 ({ data }) {
  const [isLoad, setIsLoad] = useState(true);
  
  useEffect(() => setIsLoad(data ? false : true), [data]);

  return (
    <Container>
      {isLoad ? <Loading /> : (
        <>
          <ProgressContainer width='60%' data={data} />
          <ChartContainer width='40%' data={data} />
        </>
      )}
    </Container>
  )
}

const Container = Styled.div`
  flex: 1;
  display: flex;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;

  & > section {
    height: 100%;
  }
`;