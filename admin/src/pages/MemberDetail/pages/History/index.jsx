import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';
import HistoryLi from './HistoryLi';

export default function 히스토리 () {
  const params = useParams();
  const userId = params?.id;
  const [list, setList] = useState([]);

  const getList = () => {
    useAxios.get('/userHistory/' + userId).then(({ data }) => {
      if (!data?.result) return setList([]);
      setList(data?.data);
    })
  }

  useEffect(getList, []);
  return (
    <PageAnimate name='slide-up' style={{ overflow: 'auto', padding: 10 }}>
      {list?.map(item => (
        <HistoryLi key={item?.ID} data={item} />
      ))}
    </PageAnimate>
  )
}

