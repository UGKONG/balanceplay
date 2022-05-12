import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useStore from '%/useStore';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';
import useCleanArray from '%/useCleanArray';
import Page from './Page';

export const Progress = ({ now = 0, all = 0 }) => {

  const calc = useMemo(() => {
    if (all === 0) return { originalPercent: 0, percent: 0 };
    let originalPercent = now / all * 100;
    let percent = Math.round(originalPercent);
    return { originalPercent, percent };
  }, [now, all]);
  
  return (
    <ProgressWrap>
      <p>전체 답변 진행율: {all} 중 {now} 완료 ({calc.percent}%)</p>
      <div><span style={{ width: calc.originalPercent + '%' }} /></div>
    </ProgressWrap>
  )
};

export default function 검사지작성 () {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const testId = params?.id;
  const dispatch = useStore(x => x.setState);
  const sendData = useStore(x => x.surveySendData);
  const [data] = useState(location.state ?? null);
  const [surveyData, setSurveyData] = useState({ category: [], ask: [], answer: [] });
  const [pageList, setPageList] = useState([]);
  const [activePageId, setActivePageId] = useState(1);
  // const [sendData, setSendData] = useState([]);

  const check = () => {
    if (!data) return navigate(-1);
    getCategoryList();
    sendDataInit();
  }
  // 토탈 데이터 스토어 사용 준비
  const sendDataInit = () => {
    dispatch('surveySendData', []);
  }
  // 검사 카테고리, 질문, 답변 정보 불러옴
  const getCategoryList = () => {
    let id = data?.ID;
    if (!id) return;
    useAxios.get('/doSurvey/' + id).then(({ data }) => {
      if (!data?.result) {
        setSurveyData({});
        useAlert.warn('검사지 신규작성', data?.msg || '데이터가 없습니다.');
        return;
      }
      setSurveyData(data?.data);
      console.log(data?.data);
    });
  }
  // 페이지 생성
  const pageInit = () => {
    console.log(surveyData);

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
  // 닫기 버튼 클릭
  const closeBtnClick = () => {
    let ask = confirm('검사지를 닫으시겠습니까?');
    if (!ask) return;
    navigate(-1);
  }
  // 다음 페이지
  const nextPage = ({ activeCategory, activeAskList }) => {
    let allAskCount = activeAskList?.length ?? 0;
    let checkAskCount = sendData.filter(x => x?.CATEGORY === activeCategory?.ID)?.length;
    if (allAskCount > checkAskCount) return useAlert.warn('검사지 신규작성', '응답하지 않은 검사가 존재합니다.');

    setActivePageId(prev => prev + 1);
  }
  // 저장
  const submit = () => {
    const allAskCount = useCleanArray(surveyData?.ask, 'CATEGORY_ID')?.length;
    const checkAskCount = sendData?.length;
    if (allAskCount > checkAskCount) return useAlert.warn('검사지 신규작성', '응답하지 않은 검사가 존재합니다.');

    let ask = confirm('검사지를 제출하시겠습니까?');
    if (!ask) return;

    let form = { testTypeId: data?.ID, testName: data?.NAME, data: sendData };
    useAxios.post('/doSurvey/' + testId, form).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('검사지 신규저장', data?.msg);
        return;
      }
      useAlert.success('검사지 신규저장', data?.data);
      navigate(-1);
    });
  }
  // 다음 버튼 클릭 시
  const nextBtnClick = () => {
    let isFinal = pageList?.length <= activePageId;
    let result = isFinal ? submit : nextPage;
    return result;
  };

  // 페이지 상태 표시
  const pageStatusAction = useMemo(() => {
    let isFinal = pageList?.length <= activePageId;
    let status = { now: activePageId ?? 0, all: pageList?.length ?? 0 }
    let text = isFinal ? '전 송' : '다 음';
    return { status, text }
  }, [pageList, activePageId]);

  useEffect(check, []);
  useEffect(pageInit, [surveyData]);

  return (
    <PageAnimate name='slide-up' style={{ position: 'relative' }}>
      <header>
        <h2>
          신규 { data?.NAME ?? '검사' }
          <button onClick={closeBtnClick}>검사지 닫기</button>
        </h2>
        <Description>{data?.DESCRIPTION}</Description>
        <Progress 
          now={sendData?.length} 
          all={Math.round(surveyData?.ask?.length / surveyData?.category?.length * pageList?.length)} 
        />
        <SurveyDescription>다음 설문 문항에 해당되는 답변을 체크 하시면 됩니다.</SurveyDescription>
      </header>

      <Page 
        categoryList={filterCategory(pageList[activePageId - 1])} 
        askList={surveyData?.ask} answerList={surveyData?.answer}
        pageStatusAction={pageStatusAction} activePageId={activePageId}
        nextBtnClick={nextBtnClick()}
      />
    </PageAnimate>
  )
}

const ProgressWrap = Styled.div`
  position: sticky;
  bottom: 0;
  background-color: #f1f9f8;
  p {
    font-size: 12px;
    font-weight: 400;
    color: #777;
    letter-spacing: 1px;
    margin-top: 10px;
  }
  div {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    height: 5px;
    min-height: 5px;
    max-height: 5px;
    background-color: #ddd;
    margin-top: 4px;
    overflow: hidden;
    border-radius: 10px;
    span {
      display: block;
      width: 0%;
      height: 100%;
      transition: 0.4s;
      background-color: #008a87;
      border-radius: 10px;
    }
  }
`;
const Description = Styled.p`
  font-size: 13px;
  color: #888;
  margin-top: 10px;
`;
const SurveyDescription = Styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: #888;
`;