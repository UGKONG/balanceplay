import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import Checkbox from '%/Checkbox';
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';
import termsInfo from '~/terms/termsInfo.txt';
import terms1 from '~/terms/terms1.txt';
import terms2 from '~/terms/terms2.txt';
import terms3 from '~/terms/terms3.txt';
import terms4 from '~/terms/terms4.txt';
import terms5 from '~/terms/terms5.txt';

export default function () {
  const location = useLocation();
  const navigate = useNavigate();
  const loginData = location.state;

  const [termsInfoText, setTermsInfoText] = useState('');
  const [termsText1, setTermsText1] = useState('');
  const [termsText2, setTermsText2] = useState('');
  const [termsText3, setTermsText3] = useState('');
  const [termsText4, setTermsText4] = useState('');
  const [termsText5, setTermsText5] = useState('');
  
  const [termsCheck1, setTermsCheck1] = useState(false);
  const [termsCheck2, setTermsCheck2] = useState(false);
  const [termsCheck3, setTermsCheck3] = useState(false);
  const [termsCheck4, setTermsCheck4] = useState(false);
  const [termsCheck5, setTermsCheck5] = useState(false);

  const getTermsText = () => {
    useAxios.get(termsInfo).then(({ data }) => setTermsInfoText(data));
    useAxios.get(terms1).then(({ data }) => setTermsText1(data));
    useAxios.get(terms2).then(({ data }) => setTermsText2(data));
    useAxios.get(terms3).then(({ data }) => setTermsText3(data));
    useAxios.get(terms4).then(({ data }) => setTermsText4(data));
    useAxios.get(terms5).then(({ data }) => setTermsText5(data));
  }
  const loginCheck = () => {
    !loginData?.userAuthId && navigate('/login');
  }
  const allCheck = checked => {
    setTermsCheck1(checked);
    setTermsCheck2(checked);
    setTermsCheck3(checked);
    setTermsCheck4(checked);
    setTermsCheck5(checked);
  }
  const validator = () => {
    if (
      !termsCheck1 ||
      !termsCheck2 ||
      !termsCheck3 ||
      !termsCheck4 ||
      !termsCheck5
    ) return useAlert.warn('약관', '모든 약관에 동의해주세요');
    termsOK();
  }
  const termsOK = () => {
    useAlert.success('약관', '모든 약관에 동의하였습니다');
    navigate('/join', { state: loginData });
  }

  useEffect(getTermsText, []);
  useEffect(loginCheck, []);

  return (
    <Wrap>
      <h1>약관 내용</h1>
      <TermsDescription>{termsInfoText}</TermsDescription>
      <Row>
        <Title>1. 수집하는 개인정보</Title>
        <Text value={termsText1} readonly />
        <CheckboxWrap status={termsCheck1}>동의
          <Checkbox checked={termsCheck1} onChange={e => setTermsCheck1(e)} />
        </CheckboxWrap>
      </Row>
      <Row>
        <Title>2. 수집한 개인정보의 이용</Title>
        <Text value={termsText2} readonly />
        <CheckboxWrap status={termsCheck2}>동의
          <Checkbox checked={termsCheck2} onChange={e => setTermsCheck2(e)} />
        </CheckboxWrap>
      </Row>
      <Row>
        <Title>3. 개인정보의 보관기간</Title>
        <Text value={termsText3} readonly />
        <CheckboxWrap status={termsCheck3}>동의
          <Checkbox checked={termsCheck3} onChange={e => setTermsCheck3(e)} />
        </CheckboxWrap>
      </Row>
      <Row>
        <Title>4. 개인정보 수집 및 이용동의를 거부할 권리</Title>
        <Text value={termsText4} readonly />
        <CheckboxWrap status={termsCheck4}>동의
          <Checkbox checked={termsCheck4} onChange={e => setTermsCheck4(e)} />
        </CheckboxWrap>
      </Row>
      <Row>
        <Title>5. 개인정보 3자 동의</Title>
        <Text value={termsText5} readonly />
        <CheckboxWrap status={termsCheck5}>동의
          <Checkbox checked={termsCheck5} onChange={e => setTermsCheck5(e)} />
        </CheckboxWrap>
      </Row>
      <RowCenter>
        <CheckboxWrap>전체동의
          <Checkbox checked={
            termsCheck1 &&
            termsCheck2 &&
            termsCheck3 &&
            termsCheck4 &&
            termsCheck5
          } onChange={allCheck} />
        </CheckboxWrap>
      </RowCenter>
      <Row>
        <NextBtn class='btn' onClick={validator}>확인</NextBtn>
      </Row>
    </Wrap>
  )
}

const Wrap = Styled.main`
  height: 100%;
`;
const TermsDescription = Styled.pre`
  word-break: keep-all;
  white-space: pre-wrap;
  font-size: 13px;
  color: #444;
  margin-bottom: 20px;
`;
const Row = Styled.div`
  margin-bottom: 20px;
`;
const RowCenter = Styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Title = Styled.h2``;
const Text = Styled.textarea`
  width: 100%;
  height: 80px;
  font-size: 12px;
  &::-webkit-scrollbar {
    width: 5px !important;
  }
`;
const CheckboxWrap = Styled.p`
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${x => x.status ? '#14a414' : '#888'};
`;
const NextBtn = Styled.button`
  width: 100%;
`;