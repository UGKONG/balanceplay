import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import TestInfoContainer from './TestInfoContainer';
import Loading from '@/pages/Common/Loading';
import ResultContainer from './ResultContainer';

export default function 검사상세페이지 () {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState({});
  const [isLoad, setIsLoad] = useState(true);

  const getData = () => {
    useAxios.get('/memberTestResult/' + id).then(({ data }) => {
      setIsLoad(false);
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
      {isLoad ? <Loading /> : (<>
        <Header>
          <Title>검사정보 상세보기 <s>측정일: {data?.testData?.CREATE_DATE}</s></Title>
          <span>
            {<DeleteBtn onClick={deleteTest}>검사정보 삭제</DeleteBtn>}
            <BackBtn onClick={() => navigate(-1)}>뒤로가기</BackBtn>
          </span>
        </Header>
        <Contents>
          <TestInfoContainer data={data?.testTypeData} />
          <ResultContainer data={data?.testPointData} />
        </Contents>
      </>)}
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2`
  s {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 1px;
    margin-left: 6px;
  }
`;
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
  flex-direction: column;
`;