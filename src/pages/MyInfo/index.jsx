import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function 나의정보페이지 () {
  const [data, setData] = useState(null);

  const getData = () => {

  }

  useEffect(getData, []);

  return (
    <PageAnimate name='slide-up'>
      <Title>내정보</Title>

    </PageAnimate>
  )
}

const Title = Styled.h2`

`;