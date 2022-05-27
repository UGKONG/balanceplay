import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import Info from './Info';
import Menu from './Menu';
import Test from './pages/Test';
import Voucher from './pages/Voucher';
import Memo from './pages/Memo';
import History from './pages/History';
import Body from './pages/Body';

export default function 회원상세페이지 () {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState(null);
  const [activeMenu, setActiveMenu] = useState(1);

  const getData = () => {
    useAxios.get('/member/' + id).then(({ data }) => {
      if (!data?.result || !data?.data) {
        useAlert.error('알림', '회원정보가 존재하지 않습니다.');
        return navigate('/member');
      }
      console.log(data?.data);
      setData(data?.data);
    })
  }

  useEffect(getData, []);

  if (!data) return null;

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>회원정보 상세보기</Title>
        <BackBtn onClick={() => navigate('/member')}>뒤로가기</BackBtn>
      </Header>
      <Contents>
        <Left>
          <Info data={data} />
          <Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </Left>
        <Right>
          {activeMenu === 1 && <Test />}
          {activeMenu === 2 && <Voucher />}
          {activeMenu === 3 && <Memo />}
          {activeMenu === 4 && <History />}
          {activeMenu === 5 && <Body />}
        </Right>
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2``;
const BackBtn = Styled.button``;
const Contents = Styled.section`
  display: flex;
  & > section {
    height: 100%;
  }
`;
const Left = Styled.section`
  width: 20vw;
  min-width: 300px;
  max-width: 350px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
`;
const Right = Styled.section`
  border: 2px solid #b9e1dc;
  border-radius: 10px;
  flex: 1;
  overflow: hidden;
`;