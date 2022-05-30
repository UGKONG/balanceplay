import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import Info from './Info';
import Menu from './Menu';

export default function 회원상세페이지 () {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState(null);
  const [activeMenu, setActiveMenu] = useState(1);

  const getData = () => {
    useAxios.get('/teacher/' + id).then(({ data }) => {
      if (!data?.result || !data?.data) {
        useAlert.error('알림', '선생님 정보가 존재하지 않습니다.');
        return navigate('/teacher');
      }
      setData(data?.data);
    })
  }
  const deleteMember = () => {
    let ask = confirm('선생님을 삭제하시겠습니까?');
    if (!ask) return;
    return useAlert.info('알림', '준비중입니다.');;
    useAxios.delete('/teacher', { data: { idArr: [id] } }).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('선생님 삭제', '선생님이 삭제되지 않았습니다.');
        return;
      }
      useAlert.success('선생님 삭제', '선생님이 삭제되었습니다.');
      navigate('/member');
    });
  }

  useEffect(getData, []);

  if (!data) return null;

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>선생님정보 상세보기</Title>
        <span>
          <DeleteBtn onClick={deleteMember}>삭제</DeleteBtn>
          <BackBtn onClick={() => navigate('/teacher')}>뒤로가기</BackBtn>
        </span>
      </Header>
      <Contents>
        <Left>
          <Info data={data} setData={setData} />
          <Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </Left>
        <Right>
          {/* {activeMenu === 1 && <Test />}
          {activeMenu === 2 && <Voucher />}
          {activeMenu === 3 && <Schedule />}
          {activeMenu === 4 && <Memo />}
          {activeMenu === 5 && <History />}
          {activeMenu === 6 && <Body />} */}
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