import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';
import VoucherLi from './VoucherLi';
import Loading from '@/pages/Common/Loading';

export default function 보유이용권 () {
  const params = useParams();
  const userId = params?.id;
  const [isLoad, setIsLoad] = useState(true);
  const [list, setList] = useState([]);

  const getList = () => {
    useAxios.get('/userVoucher/' + userId).then(({ data }) => {
      if (!data?.result) return setList([]);
      setList(data?.data);
      setIsLoad(false);
    })
  }

  useEffect(getList, []);

  return (
    <PageAnimate name='slide-up' style={{ overflow: 'auto' }}>
      <Header>
        <VoucherBuyBtn>이용권 구매</VoucherBuyBtn>
      </Header>
      <VoucherList>
        {isLoad ? <Loading /> : (
          <>
          {list?.length === 0 && <NotLi>보유중인 이용권이 없습니다.</NotLi>}
          {list?.map(item => <VoucherLi key={item?.ID} data={item} getList={getList} />)}
          </>
        )}
      </VoucherList>
    </PageAnimate>
  )
}

const Header = Styled.div`
  height: 44px;
  padding: 10px 10px 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const VoucherList = Styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0 5px 5px;
  width: 100%;
  height: calc(100% - 44px);
  overflow: auto;
  align-content: flex-start;
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
const VoucherBuyBtn = Styled.button`

`;