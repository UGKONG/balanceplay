import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAlert from '%/useAlert';

export default function 초기면접지데이터보기 () {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location?.state?.data;

  const check = () => {
    if (!data) {
      useAlert.error('초기면접지', '사용자 데이터가 없습니다.');
      navigate('/myInfo/');
      return;
    }
  }
  const closeBtnClick = () => navigate('/myInfo/');

  useEffect(check, [data]);

  return (
    <PageAnimate name='slide-up'>
      <TitleName>초기면접지</TitleName>
      <Row>
        <Title>인적사항</Title>
        <Field>이름 : {data?.NAME}</Field>
        <Field>생년월일 : {data?.BIRTH}</Field>
        <Field>성별 : {data?.GENDER === 'M' ? '남자' : '여자'}</Field>
        <Field>신장 : {data?.HEIGHT}Cm</Field>
        <Field>체중 : {data?.WEIGHT}Kg</Field>
        <Field>소속기관 : {data?.OGDP_NAME}</Field>
      </Row>

      <Row>
        <Title>언어인지 발달 수준</Title>
        <Field>{data?.TEST_NAME}</Field>
      </Row>

      <Row>
        <Title>사전 검사</Title>
        <SubTitle>생활습관</SubTitle>
        <Field>수면 : {data?.NOW1 === 1 ? '양호' : '개선필요'}</Field>
        <Field>배변 : {data?.NOW2 === 1 ? '양호' : '개선필요'}</Field>
        <Field>식사 : {data?.NOW3 === 1 ? '양호' : '개선필요'}</Field>
        <SubTitle>사회성 수준</SubTitle>
        <Field>또래관계 : {data?.NOW4 === 1 ? '양호' : '개선필요'}</Field>
        <Field>가족관계 : {data?.NOW5 === 1 ? '양호' : '개선필요'}</Field>
      </Row>

      <Row>
        <Title>특이사항</Title>
        <Field>발달사항 진단여부 : {data?.IS_OTHER === 1 ? 'O' : 'X'}</Field>
        {data?.OTHER_DESCRIPTION && (
          <>설명<Field>{data?.OTHER_DESCRIPTION}</Field></>
        )}
      </Row>

      <Row>
        <CompleteBtn onClick={closeBtnClick}>닫 기</CompleteBtn>
      </Row>
    </PageAnimate>
  )
}

const TitleName = Styled.h2``;
const Row = Styled.div`
  margin-bottom: 10px;
`;
const Title = Styled.h3`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row;
  flex-wrap: nowrap;
  font-size: 16px;
  font-weight: 500;
  color: #008a87;
  margin-top: 10px;
  margin-bottom: 10px;

  &::after {
    content: '';
    flex: 1;
    margin-left: 10px;
    height: 2px;
    background-color: #74c2b9;
  }
`;
const SubTitle = Styled.h4`
  font-weight: 500;
  color: #008a87;
  font-size: 14px;
  padding-bottom: 5px;
  text-indent: 2px;
`;
const Field = Styled.div`
  font-size: 14px;
  font-weight: 400;
  text-indent: 3px;
  color: #282828;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 4px;
`;
const CompleteBtn = Styled.button`
  width: 100%;
  margin: 0;
  margin-top: 20px;
`;