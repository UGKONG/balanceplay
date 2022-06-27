import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function 검사상세페이지 () {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState({});

  const getData = () => {
    useAxios.get('/memberTestResult/' + id).then(({ data }) => {
      if (!data?.result || !data?.data) return useAlert?.error('알림', data?.msg);
      console.log(data?.data);
      setData(data?.data);
    });
  }

  const deleteTest = () => {
    return useAlert.info('알림', '점검중입니다.');
    let ask = confirm('해당 검사결과를 삭제하시겠습니까?');
    if (!ask) return;

    useAxios.delete('/memberTestResult/' + id).then(({ data }) => {
      if (!data?.result) return useAlert?.error('알림', data?.msg);
      navigate(-1);
    })
  }

  useEffect(getData, []);

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>검사정보 상세보기</Title>
        <span>
          {<DeleteBtn onClick={deleteTest}>검사정보 삭제</DeleteBtn>}
          <BackBtn onClick={() => navigate(-1)}>뒤로가기</BackBtn>
        </span>
      </Header>
      <Contents>

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