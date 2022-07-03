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
  const [isLoad, setIsLoad] = useState(true);
  const [userId, setUserId] = useState(state?.userId);
  const [voucherId, setVoucherId] = useState(state?.voucherId);
  const [data, setData] = useState({});
  
  const getData = () => {
    if (!userId || !voucherId) return;
    useAxios.get('/payment/' + userId + '/' + voucherId).then(({ data }) => {
      setIsLoad(false);
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
        {isLoad ? <Loading /> : (
          <>
            <Left>
              <Box.Container>
                <Box.Title>회원 정보</Box.Title>
                <Box.Contents>
                  {JSON.stringify(data?.user)}
                </Box.Contents>
              </Box.Container>
              <Box.Container>
                <Box.Title>이용권 정보</Box.Title>
                <Box.Contents>
                  {JSON.stringify(data?.voucher)}
                </Box.Contents>
              </Box.Container>
              <Box.Container>
                <Box.Title>결제 정보</Box.Title>
                <Box.Contents>
                  -
                </Box.Contents>
              </Box.Container>
            </Left>
            <Right>
              <Box.Container>
                <Box.Title>최종 결제 금액</Box.Title>
                <Box.Contents>
                  -
                </Box.Contents>
              </Box.Container>
              <SubmitBtn>결제하기</SubmitBtn>
            </Right>
          </>
        )}
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2``;
const BackBtn = Styled.button``;
const Contents = Styled.section`
  display: flex;
`;
const Left = Styled.article`
  width: calc(100% - 320px);
  height: 100%;
`;
const Right = Styled.article`
  width: 300px;
  min-width: 300px;
  height: 100%;
  margin-left: 20px;
`;
const Box = {
  Container: Styled.div`
    padding: 20px;
    display: block !important;
    background-color: #fefefe;
    border: 1px solid #eee;
    margin-bottom: 20px;
  `,
  Title: Styled.h3`
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    font-weight: 500;
  `,
  Contents: Styled.section`
    padding-top: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    word-break: break-all;
  `,
}
const SubmitBtn = Styled.button`
  border: 1px solid transparent;
  width: 100%;
  height: 46px;
  font-size: 16px;
  letter-spacing: 4px;
  border-radius: 0;
`