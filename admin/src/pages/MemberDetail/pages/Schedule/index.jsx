import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';

export default function 스케줄 () {
  const params = useParams();
  const userId = params?.id;
  const [list, setList] = useState([]);

  const getList = () => {
    
  }

  useEffect(getList, []);

  return (
    <PageAnimate name='slide-up' 
      style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}
    >
      스케줄
    </PageAnimate>
  )
}
