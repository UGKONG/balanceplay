import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';

export const Progress = ({ percent }) => (
    <ProgressWrap>
      <p>답변 진행율: {percent}%</p>
      <div><span style={{ width: percent + '%' }} /></div>
    </ProgressWrap>
);

export default function () {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({ info: {}, askList: [], answerList: [] });

  // 전 페이지에서 검사 자체 정보를  불러옴
  const update = () => {
    setData(prev => {
      let temp = {...prev};
      temp.info = location.state ?? {};
      return temp;
    });
  }
  // 검사 카테고리, 질문, 답변 정보 불러옴
  const getData = () => {
    let id = data?.info?.ID;
    if (!id) return;
    useAxios.get('/doSurvey/' + id).then(({ data }) => {
      console.log(data);
    })
  }

  useEffect(update, []);
  useEffect(getData, [data]);

  return (
    <PageAnimate name='slide-up'>
      <header>
        <h2>
          { data?.info?.NAME }
          <button onClick={() => navigate(-1)}>검사지 닫기</button>
        </h2>
        <Description>{data?.info?.DESCRIPTION}</Description>
        <Progress percent={0} />
        <SurveyDescription>다음 설문 문항에 해당되는 답변을 체크 하시면 됩니다.</SurveyDescription>
        <CategoryName>카테고리 이름</CategoryName>
        <CategoryDescription>카테고리 설명</CategoryDescription>
      </header>
      
      {/* <article>
        <ul>
          <AskList
            v-for="(ask, idx) in askList[activePage]"
            :key="idx"
            :idx="idx"
            :ask="ask"
            :resultList="resultList"
            :answerList="answerList"
          />
        </ul>
      </article>
      <!-- 버튼 -->
      <footer>
        <!-- <button v-if="activePage != 0" @click="activePage -= 1">이전 (임시)</button> -->
        <button v-if="!isEnd" @click="nextPage(false)">다 음</button>
        <button v-if="isEnd" @click="nextPage(true)">최종확인</button>
      </footer> */}
    </PageAnimate>
  )
}

const ProgressWrap = Styled.div`
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
  margin-top: 5px;
`;
const SurveyDescription = Styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: #888;
`;
const CategoryName = Styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #008a87;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row;
  flex-wrap: nowrap;
  margin-top: 20px;
`;
const CategoryDescription = Styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #777;
  margin-top: 4px;
`;