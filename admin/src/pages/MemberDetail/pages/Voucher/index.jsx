import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';
import VoucherLi from './VoucherLi';

export default function 보유이용권 () {
  const params = useParams();
  const userId = params?.id;
  const [list, setList] = useState([]);

  const getList = () => {
    useAxios.get('/userVoucher/' + userId).then(({ data }) => {
      if (!data?.result) return setList([]);
      setList(data?.data);
    })
  }

  useEffect(getList, []);

  return (
    <PageAnimate name='slide-up' style={{ overflow: 'auto' }}>
      <VoucherList>
        {list?.map(item => (
          <VoucherLi key={item?.ID} data={item} />
        ))}
      </VoucherList>
    </PageAnimate>
  )
}

const VoucherList = Styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
`;