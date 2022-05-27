import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useAxios from '%/useAxios';
import PageAnimate from '%/PageAnimate';
import MainLi from './MainLi';

export default function 검사개요() {
  const [data, setData] = useState(null);

  const getData = () => {
    useAxios.get('/testInformation').then(({ data }) => {
      if (!data?.result) return useAlert.error('검사 개요', data?.msg);
      setData(data?.data);
    })
  }
  const subFilter = typeId => {
    return data?.sub?.filter(x => x.TYPE_ID === typeId);
  }

  useEffect(getData, []);

  return (
    <PageAnimate name='slide-up'>
      <h2>검사 개요</h2>
      {data?.main?.length > 0 && <TestList>
        {data?.main?.map((item, i) => (
          <MainLi key={item.ID} idx={i} item={item} sub={subFilter(item?.ID)} />
        ))}
      </TestList>}
    </PageAnimate>
  )
}

const TestList = Styled.ul`
  padding: 5px 0;
`;