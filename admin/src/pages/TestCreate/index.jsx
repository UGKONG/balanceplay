import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useStore from '%/useStore';
import useCleanArray from '%/useCleanArray';
import ProgressContainer from './ProgressContainer';
import Page from './Page';

export default function 신규검사 () {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const userId = Number(params?.id ?? null);
  const testTypeId = Number(location?.state?.testTypeId ?? null);
  const testTypeName = location?.state?.testTypeName ?? '';
  const [surveyData, setSurveyData] = useState({ category: [], ask: [], answer: [] });
  const [pageList, setPageList] = useState([]);
  const [activePageId, setActivePageId] = useState(1);
  const dispatch = useStore(x => x.setState);
  const isLogin = useStore(x => x.isLogin);
  const sendData = useStore(x => x.surveySendData);

  if (!testTypeId || !testTypeName || !userId) {
    navigate(userId ? ('/member/' + userId) : -1);
    return null;
  }

  const init = () => {
    useAlert.info('알림', testTypeName + '입니다.');
    dispatch('surveySendData', []);
    getCategoryList();
  }
  // 페이지 생성
  const pageInit = () => {
    if (surveyData?.category?.length === 0) return;
    let field = 'PAGE_ID', temp = [];
    let cleanArr = useCleanArray([...surveyData?.category], field, ['PAGE_ID']);
    cleanArr.forEach(item => temp.push(item[field]));
    setPageList(temp);
  }
  // 검사 카테고리, 질문, 답변 정보 불러옴
  const getCategoryList = () => {
    if (!testTypeId) return;
    useAxios.get('/doSurvey/' + testTypeId).then(({ data }) => {
      if (!data?.result) {
        useAlert.warn('알림', '해당 검사지는 점검중입니다.');
        navigate(userId ? ('/member/' + userId) : -1);
        return;
      }
      setSurveyData(data?.data);
    });
  }
  
  // 페이지 별 카테고리 필터 함수
  const filterCategory = id => {
    return surveyData?.category?.filter(x => x.PAGE_ID === id)
  }

  // 닫기 버튼 클릭
  const backBtnClick = () => {
    let ask = confirm('검사지를 닫으시겠습니까?');
    if (!ask) return;
    navigate(-1);
  }
  // 다음 페이지로 이동
  const nextPage = ({ activeCategory, activeAskList }) => {
    let allAskCount = activeAskList?.length ?? 0;
    let checkAskCount = sendData.filter(x => x?.CATEGORY === activeCategory?.ID)?.length;
    if (allAskCount > checkAskCount) return useAlert.warn('검사지 신규작성', '응답하지 않은 검사가 존재합니다.');

    setActivePageId(prev => prev + 1);
  }
  // 다음 버튼 클릭 시
  const nextBtnClick = () => {
    let isFinal = pageList?.length <= activePageId;
    let result = isFinal ? submit : nextPage;
    return result;
  };
  // 페이지 진행 상태 표시
  const pageStatusAction = useMemo(() => {
    let isFinal = pageList?.length <= activePageId;
    let status = { now: activePageId ?? 0, all: pageList?.length ?? 0 }
    let text = isFinal ? '전 송' : '다 음';
    return { status, text }
  }, [pageList, activePageId]);
  // 저장
  const submit = () => {
    const allAskCount = useCleanArray(surveyData?.ask, 'CATEGORY_ID')?.length;
    const checkAskCount = sendData?.length;
    if (allAskCount > checkAskCount) return useAlert.warn('검사지 신규작성', '응답하지 않은 검사가 존재합니다.');

    let ask = confirm('검사지를 제출하시겠습니까?');
    if (!ask) return;

    let form = { 
      testTypeId, 
      testName: testTypeName, 
      data: sendData, 
      adminId: isLogin?.ID,
      adminName: isLogin?.NAME,
    };
    useAxios.post('/doSurvey/' + testTypeId, form).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('알림', data?.msg);
        return;
      }
      useAlert.success('알림', data?.data);
      navigate(-1);
    });
  }

  useEffect(init, []);
  useEffect(pageInit, [surveyData]);

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>신규검사</Title>
        <BackBtn onClick={backBtnClick}>뒤로가기</BackBtn>
      </Header>
      <Contents>
        {/* testTypeId: {testTypeId}<br />
        userId: {userId} */}
        <ProgressContainer 
          now={sendData?.length} 
          all={Math.round(surveyData?.ask?.length / surveyData?.category?.length * pageList?.length)} 
        />
        <Page 
          categoryList={filterCategory(pageList[activePageId - 1])} 
          askList={surveyData?.ask} answerList={surveyData?.answer}
          pageStatusAction={pageStatusAction} activePageId={activePageId}
          nextBtnClick={nextBtnClick()}
        />
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2``;
const BackBtn = Styled.button``;
const Contents = Styled.section`
  display: flex;
  flex-direction: column;
`;