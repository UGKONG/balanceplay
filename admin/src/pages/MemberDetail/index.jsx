import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import Info from './Info';
import Menu from './Menu';
import Test from './pages/Test';
import Voucher from './pages/Voucher';
import Schedule from './pages/Schedule';
import Memo from './pages/Memo';

export default function 회원상세페이지 () {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState(null);
  const [activeMenu, setActiveMenu] = useState(1);

  const getData = () => {
    useAxios.get('/member/' + id).then(({ data }) => {
      if (!data?.result || !data?.data) {
        useAlert.error('알림', '회원 정보가 존재하지 않습니다.');
        return navigate('/member');
      }
      setData(data?.data);
    })
  }
  const deleteMember = () => {
    if (Number(id) === 1) return useAlert.warn('알림', '게스트 회원은 삭제할 수 없습니다.');
    let ask = confirm('회원을 삭제하시겠습니까?');
    if (!ask) return;

    useAxios.delete('/member', { data: { idArr: [id] } }).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('회원삭제', '회원이 삭제되지 않았습니다.');
        return;
      }
      useAlert.success('회원삭제', '회원이 삭제되었습니다.');
      navigate('/member');
    });
  }

  useEffect(getData, []);

  if (!data) return null;

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>회원정보 상세보기</Title>
        <span>
          {Number(id) !== 1 && <DeleteBtn onClick={deleteMember}>삭제</DeleteBtn>}
          <BackBtn onClick={() => navigate('/member')}>뒤로가기</BackBtn>
        </span>
      </Header>
      <Contents>
        <Left>
          <Info data={data} setData={setData} />
          <Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </Left>
        <Right>
          {activeMenu === 1 && <Test />}
          {activeMenu === 2 && <Voucher />}
          {activeMenu === 3 && <Schedule />}
          {activeMenu === 4 && <Memo memo={data?.MEMO} />}
        </Right>
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2``;
const DeleteBtn = Styled.button`
  border: 1px solid #ff4f4f !important;
  background-color: #ee6d6d !important;
  &:hover {
    background-color: #ec6565 !important;
  }
  &:focus {
    box-shadow: 0 0 0 4px rgb(238 109 109 / 25%) !important;
  }
`;
const BackBtn = Styled.button``;
const Contents = Styled.section`
  display: flex;
  & > section {
    height: 100%;
  }
`;
const Left = Styled.section`
  width: 20vw;
  min-width: 280px;
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