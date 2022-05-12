import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function ({ id, title, allCount, totalData, setTotalData }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const save = () => {
    useAxios.post('/join', data).then(({ data }) => {
      if (!data?.result || !data?.data) {
        useAlert.error('초기면접지', data?.msg);
        return;
      }

      let user = data?.data;
      login(user);
    });
  }
  const login = (data) => {
    useAxios.post('/login', data).then(({ data }) => {
      if (!data?.result) return useAlert.error('로그인 실패', data?.msg);
      useAlert.success('회원가입 성공', data?.data?.NAME + '님 환영합니다.');
      navigate('/');
    });
  }

  const complete = () => {
    let ask = confirm('최종 저장하시겠습니까?\n한 번 저장하시면 수정하실 수 없습니다.');
    if (!ask) return;
    save();
  }

  useEffect(() => setData(totalData), []);

  return (
    <>
      <h2>{title} ({id}/{allCount})</h2>
      <Row>
        <Title>인적사항</Title>
        <Field>이름 : {data?.info?.name}</Field>
        <Field>생년월일 : {data?.info?.birth}</Field>
        <Field>성별 : {data?.info?.gender === 'M' ? '남자' : '여자'}</Field>
        <Field>신장 : {data?.info?.height}</Field>
        <Field>체중 : {data?.info?.weight}</Field>
        <Field>소속기관 유형 : {data?.info?.ogdpType?.text}</Field>
        <Field>소속기관 이름 : {data?.info?.ogdpName}</Field>
        <Field>방문동기 : {data?.info?.visitObj?.names?.join('/')}</Field>
      </Row>

      <Row>
        <Title>가족사항</Title>
        {data?.family && data.family.map((item, idx) => (
          <Field key={idx}>
            <p style={{ fontWeight: 500 }}>{item?.type}</p>
            <p>이름: {item?.name} ({item?.birth}) / {item?.height}cm / 동거: {item?.isTogether ? 'O' : 'X'}</p>
            {item?.description && <p>{item?.description}</p>}
          </Field>
        ))}
      </Row>

      <Row>
        <Title>언어인지 발달 수준</Title>
        <Field>{data?.test?.name}</Field>
      </Row>

      <Row>
        <Title>사전 검사</Title>
        <SubTitle>생활습관</SubTitle>
        <Field>수면 : {data?.now[0]?.value == '1' ? '양호' : '개선필요'}</Field>
        <Field>배변 : {data?.now[1]?.value == '1' ? '양호' : '개선필요'}</Field>
        <Field>식사 : {data?.now[2]?.value == '1' ? '양호' : '개선필요'}</Field>
        <SubTitle>사회성 수준</SubTitle>
        <Field>또래관계 : {data?.now[3]?.value == '1' ? '양호' : '개선필요'}</Field>
        <Field>가족관계 : {data?.now[4]?.value == '1' ? '양호' : '개선필요'}</Field>
      </Row>

      <Row>
        <Title>특이사항</Title>
        <Field>발달사항 진단여부 : {data?.other?.isOther ? 'O' : 'X'}</Field>
        {data?.other?.contents && <>설명<Field>{data?.other?.contents}</Field></>}
      </Row>

      <Row>
        <CompleteBtn onClick={complete}>최종저장</CompleteBtn>
      </Row>
    </>
  )
}

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
`;