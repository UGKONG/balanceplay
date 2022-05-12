import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import Calendar from './Calendar';

export default function 나의스케줄페이지 () {
  const [data, setData] = useState(null);

  const getData = () => {

  }

  useEffect(getData, []);

  return (
    <PageAnimate name='slide-up'>
      <Title>나의 스케줄</Title>
      <Calendar />
    </PageAnimate>
  )
}

const Title = Styled.h2`

`;