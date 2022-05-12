import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import PageAnimate from '%/PageAnimate';
import useCleanArray from '%/useCleanArray';
import { BsQuestionCircleFill } from 'react-icons/bs';
import TestResultLi from './TestResultLi';
import DescriptionModal from './DescriptionModal';

export default function 검사지 () {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const itemData = location.state;
  const id = params?.id;
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState(null);
  
  // 데이터 조회
  const getData = () => {
    useAxios.get('/detailResult/' + id).then(({ data }) => {
      if (!data.result) return setData(null);
      setData(data?.data);
    })
  }
  // 데이터 날짜 별 분리
  const dataDateFilter = useMemo(() => {
    let dateList = useCleanArray(data?.pointResult ?? [], 'DATE', ['DATE']);
    if (!data || !dateList) return { pointData: [], commentData: [] };
    let result = [];
    
    dateList.forEach(item => {
      let date = item?.DATE;
      let pointData = data?.pointResult?.filter(x => x?.DATE === date);
      let commentData = data?.commentResult?.filter(x => x?.DATE === date);
      result.push({ date, pointData, commentData });
    });
    return result;
  }, [data]);
  // 신규 검사 페이지 이동
  const newSurveyGo = () => {
    navigate('/survey/' + id + '/new/', { state: data?.info });
  }

  useEffect(getData, []);

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <h2>
          <Title>
            { data?.info?.NAME }
            <DescriptionBtn onClick={() => setIsModal(!isModal)}>
              <BsQuestionCircleFill color='#008a87' />
            </DescriptionBtn>
          </Title>
          {!itemData?.disabled && <button onClick={newSurveyGo}>신규 검사</button>}
        </h2>
        <Description>{data?.info?.DESCRIPTION ?? ''}</Description>
      </Header>

      <List>
        {dataDateFilter?.length === 0 && <NotLi>검사 결과가 없습니다.</NotLi>}
        {dataDateFilter?.length > 0 && dataDateFilter?.map((item, i) => (
          <TestResultLi key={i} idx={i} item={item} />
        ))}
      </List>

      {isModal && <DescriptionModal
        data={{ main: data?.info?.DESCRIPTION, sub: data?.description }}
        setIsModal={setIsModal}
      />}
    </PageAnimate>
  )
}

const Header = Styled.header``;
const Title = Styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const DescriptionBtn = Styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding: 3px;
  border: none;
  &:hover,
  &:active {
    background-color: transparent !important;
  }
  i, svg {
    font-size: 20px;
  }
`;
const Description = Styled.p`
  font-size: 12px;
  color: #888;
  margin-top: 10px;
`;
const List = Styled.ul`
  margin-top: 20px;
`;
const NotLi = Styled.li`
  font-size: 14px;
  color: #999;
  margin-top: 40px;
  text-align: center;
`;