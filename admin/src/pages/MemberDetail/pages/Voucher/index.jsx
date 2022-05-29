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
        {list?.length === 0 && <NotLi>보유중인 이용권이 없습니다.</NotLi>}
        {list?.map(item => (
          <VoucherLi key={item?.ID} data={item} getList={getList} />
        ))}
      </VoucherList>
    </PageAnimate>
  )
}

const VoucherList = Styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  width: 100%;
  height: 100%;
`;
const NotLi = Styled.li`
  color: #888;
  font-size: 14px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;