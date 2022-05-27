import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';

export default function 앱정보 ({ Style }) {
  const navigate = useNavigate();
  const [ip, setIp] = useState('');
  const [os, setOs] = useState('');
  const terms = useRef([
    { id: 1, txt: '수집하는 개인정보' },
    { id: 2, txt: '수집한 개인정보의 이용' },
    { id: 3, txt: '개인정보의 보관기간' },
    { id: 4, txt: '개인정보 수집 및 이용 동의 거부 권리' },
    { id: 5, txt: '개인정보 3자 동의' },
  ])

  const data = useMemo(() => [
    { title: '버전', contents: '1.0.0', size: null },
    { title: '출시일', contents: '미정', size: null },
    { title: '마지막 업데이트', contents: '2022년 05월 17일', size: null },
    { title: '지원언어', contents: '한국어', size: null },
    { title: '지원환경', contents: 'IOS9 이상, 안드로이드5.1 이상, 윈도우7 이상', size: 13 },
    { title: '환경', contents: os, size: null },
    { title: 'IP', contents: ip, size: null },
  ], [ip, os]);

  const getIp = () => {
    useAxios.get('/ip').then(({ data }) => {
      setIp(data?.data ?? '-');
    })
  }

  const getOs = () => {
    let agent = window?.navigator?.userAgent;
    let _os = agent?.split('(')[1]?.split(')')[0];
    if (_os) {
      if (_os?.indexOf(';') > -1) _os = _os?.split(';')[0];
    }
    setOs(_os);
  }

  useEffect(getIp, []);
  useEffect(getOs, []);

  const termPageMove = id => {
    if (!id) return;

    navigate('/info/term', {
      state: { id }
    });
  }

  return (
    <Style.Wrap>
      {data?.length > 0 && data?.map(item => (
        <Style.Row key={item?.title}>
          <Style.SubTitle>{item?.title}</Style.SubTitle>
          <Style.Contents
            style={{ fontSize: item?.size ?? 'auto' }}
            dangerouslySetInnerHTML={{ __html: item?.contents }}
          />
        </Style.Row>
      ))}

      <Terms>
        {terms?.current?.map(item => (
          <TermBtn key={item?.id} onClick={() => termPageMove(item?.id)}>{item?.txt}</TermBtn>
        ))}
      </Terms>
    </Style.Wrap>
  )
}

const Terms = Styled.div`
  margin-top: 100px;
`;
const TermBtn = Styled.button`
  width: 100%;
  margin-bottom: 4px;
  display: block;
  border: 1px solid #a9b2b2;
  background-color: #a9b2b2;
  &:hover {
    background-color: #98a0a0 !important;
  }
  &:active {
    background-color: #8c9292 !important;
  }
  &:focus {
    box-shadow: none !important;
  }
`;