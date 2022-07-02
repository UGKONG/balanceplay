import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useStore from '%/useStore';
import Loading from '@/pages/Common/Loading';
import Member from './Member';
import Voucher from './Voucher';

export default function 결제페이지 () {
  const navigate = useNavigate();
  const dispatch = useStore(x => x?.setState);
  const { state } = useLocation();
  const [userId, setUserId] = useState(state?.userId);
  const [voucherId, setVoucherId] = useState(state?.voucherId);
  const [data, setData] = useState({});
  
  const getData = () => {
    if (!userId || !voucherId) return;
    useAxios.get('/payment/' + userId + '/' + voucherId).then(({ data }) => {
      if (!data?.result || !data?.data) return setData({});
      setData(data?.data);
    });
  }
  const close = () => {
    let ask = confirm('이용권 결제페이지를 닫으시겠습니까?\n모든 결제 정보가 저장되지 않습니다.');
    if (!ask) return;
    navigate(-1);
  }
  
  useEffect(() => {
    dispatch('isFullPage', true);
    return () => dispatch('isFullPage', false);
  }, []);
  useEffect(getData, [userId, voucherId]);

  if (!userId) return <Member setUserId={setUserId} />;
  if (!voucherId) return <Voucher setVoucherId={setVoucherId} />;
  
  return (
    <PageAnimate>
      <Header>
        <Title>이용권 결제</Title>
        <span>
          <BackBtn onClick={close}>결제 닫기</BackBtn>
        </span>
      </Header>
      <Contents>
        <p style={{ wordBreak: 'break-all' }}>
          <b>회원정보</b><br />
          {JSON.stringify(data?.user)}
        </p><br />
        <p style={{ wordBreak: 'break-all' }}>
          <b>이용권정보</b><br />
          {JSON.stringify(data?.voucher)}
        </p>
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2``;
const BackBtn = Styled.button``;
const Contents = Styled.section``;