import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import useAlert from '%/useAlert';
import PointLi from './PointLi';
import CommentLi from './CommentLi';
import Chart from './Chart';

export default function ({ idx, item }) {
  if (!item?.date) return null;
  const navigate = useNavigate();
  const [isFold, setIsFold] = useState(idx > 0);

  // 작성 검사지 보기  
  const surveyedView = () => {
    return useAlert.warn('작성 검사지 보기', '준비중입니다.');
    // navigate('/survey/' + item?.TEST_ID);
  }

  const chartData = useMemo(() => ({
    labels: item?.pointData?.map(x => x?.CATEGORY_NAME),
    datasets: [{
      data: item?.pointData?.map(x => x?.POINT),
      backgroundColor: '#00ada950',
      borderColor: '#00ada990',
      borderWidth: 1,
      // pointBackgroundColor: ['#ff000020', '#00ff0020', '#0000ff20']
    }]
  }), [item]);
  
  const lastMaxPoint = useMemo(() => {
    if (!item?.pointData || item?.pointData?.length === 0) return 0;
    let temp = item?.pointData?.map(item => item?.MAX_POINT);
    temp.sort((a, b) => b - a);
    return temp[0];
  }, [item]);

  return (
    <Wrap>
      <Title>
        <Date>{item?.date}</Date>
        <SurveyedViewBtn onClick={surveyedView}>작성 검사지</SurveyedViewBtn>
      </Title>

      {!isFold && <Contents>
        <Chart data={chartData} max={lastMaxPoint} />

        {item?.pointData?.length > 0 && (
          <PointUl>
            {item?.pointData?.map((item, i) => (
              <PointLi key={i} item={item} />
            ))}
          </PointUl>
        )}

        {item?.commentData?.length > 0 && (
          <CommentUl>
            {item?.commentData?.map((item, i) => (
              <CommentLi key={i} item={item} />
            ))}
          </CommentUl>
        )}

      </Contents>}

      <FoldBtn onClick={() => setIsFold(prev => !prev)}>{isFold ? '상세정보 열기' : '상세정보 닫기'}</FoldBtn>
    </Wrap>
  )

}

const Wrap = Styled.li`
  margin-bottom: 20px;
  padding: 15px 0 0;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px 2px #44444420;
  &:last-of-type {
    margin-bottom: 0;
  }
`;
const Title = Styled.h3`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  margin-bottom: 10px;
`;
const Date = Styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #008a87;
  flex: 1;
  display: flex;
  align-items: center;
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    margin-left: 10px;
    margin-right: 5px;
    background-color: #74c2b9;
  }
`;
const SurveyedViewBtn = Styled.button`
  font-size: 12px;
  height: 28px;
  line-height: 26px;
  padding: 0 14px;
`;
const Contents = Styled.article`
  padding: 5px 14px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
`;
const PointUl = Styled.ul`
  width: 100%;
  padding-top: 10px;
`;
const CommentUl = Styled.ul`
  width: 100%;
  margin-top: 20px;
`;
const FoldBtn = Styled.button`
  margin: 0;
  display: block;
  width: 100%;
  height: 34px;
  line-height: 32px;
  border-radius: 8px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;
