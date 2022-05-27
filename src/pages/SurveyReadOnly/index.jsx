import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useStore from '%/useStore';
import useAlert from '%/useAlert';
import useCleanArray from '%/useCleanArray';
import Page from './Page';

export default function 검사데이터읽기전용 () {
  const navigate = useNavigate();
  const location = useLocation();
  const info = location?.state?.info;
  const testTypeId = location?.state?.testTypeId;
  const dispatch = useStore(x => x.setState);
  const isLogin = useStore(x => x.isLogin);
  const [surveyData, setSurveyData] = useState({ category: [], ask: [], answer: [] });
  const [pageList, setPageList] = useState([]);
  const [activePageId, setActivePageId] = useState(1);
  const [prevPageList, setPrevPageList] = useState([]);
  const wrapRef = useRef(null);
  
  if (!info) navigate('/');

  // 검사 데이터 조회
  const getData = () => {
    if (!isLogin?.TEST_FLAG) {
      useAlert.error('검사불가', '가입센터에 문의해주세요.');
      navigate('/');
    }
    useAxios.get('/surveyResult/' + testTypeId).then(({ data }) => {
      if (!data?.result || !data?.data) {
        useAlert.error('작성 검사지', data?.msg ?? '데이터를 가져오지 못했습니다.');
        navigate('/');
        return;
      }

      dispatch('surveySendData', data?.data);
      let _prevPageList = useCleanArray(data?.data, 'CATEGORY', ['CATEGORY'])
          _prevPageList = _prevPageList?.map(item => item.CATEGORY);
      setPrevPageList(_prevPageList);
      getCategoryList();
    });
  }
  // 검사 카테고리, 질문, 답변 정보 불러옴
  const getCategoryList = () => {
    if (!info?.ID) return;
    useAxios.get('/doSurvey/' + info?.ID).then(({ data }) => {
      if (!data?.result) {
        setSurveyData({});
        useAlert.warn('검사지 데이터', data?.msg || '데이터가 없습니다.');
        return;
      }
      setSurveyData(data?.data);
    });
  }
  // 페이지 생성
  const pageInit = () => {
    if (surveyData?.category?.length === 0) return;
    let field = 'PAGE_ID', temp = [];
    let cleanArr = useCleanArray([...surveyData?.category], field, ['PAGE_ID']);
    cleanArr.forEach(item => temp.push(item[field]));
    setPageList(temp);
  }
  // 페이지 별 카테고리 필터
  const filterCategory = id => {
    return surveyData?.category?.filter(x => x.PAGE_ID === id)
  }
  // 페이지 상태 표시
  const pageStatusAction = useMemo(() => ({
    now: activePageId ?? 0, all: pageList?.length ?? 0 
  }), [pageList, activePageId]);

  useEffect(getData, []);
  useEffect(pageInit, [surveyData]);

  return (
    <PageAnimate name='slide-up' el={wrapRef}>
      <Header>
        <Title>
          {info?.NAME}지 작성 내용
          <CloseBtn onClick={() => navigate(-1)}>검사지 닫기</CloseBtn>
        </Title>
        <Description>{info?.DESCRIPTION}</Description>
        <SurveyDescription>
          해당 페이지는 검사지에 답만 내용을 보는 페이지입니다.<br />
          <b>답변 결과를 변경할 수 없습니다.</b>
        </SurveyDescription>
      </Header>

      <Page
        pageId={prevPageList[activePageId - 1]}
        categoryList={filterCategory(pageList[activePageId - 1])} 
        askList={surveyData?.ask} answerList={surveyData?.answer}
        pageStatusAction={pageStatusAction} activePageId={activePageId}
        setActivePageId={setActivePageId} pageRef={wrapRef}
      />
    </PageAnimate>
  )
}

const Header = Styled.header``;
const Title = Styled.h2``;
const CloseBtn = Styled.button``;
const Description = Styled.p`
  font-size: 13px;
  color: #888;
  margin-top: 10px;
`;
const SurveyDescription = Styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: #888;
  b {
    color: #ec6464;
  }
`;

