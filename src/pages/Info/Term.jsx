import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import axios from 'axios';

export default function 약관내용페이지 () {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const [term, setTerm] = useState('');

  const getTerm = () => {
    if (!id) return navigate('/info');
    axios.get(`/otherFile/terms${id}.txt`).then(({ data }) => {
      setTerm(data ?? '');
    })
  }

  useEffect(getTerm, [id]);

  return (
    <PageAnimate name='slide-up' style={{ 
      display: 'flex', overflow: 'hidden', padding: 10, flexDirection: 'column'
    }}>
      <TermText defaultValue={term} readOnly={true} />
      <CloseBtn onClick={() => navigate('/info')}>닫 기</CloseBtn>
    </PageAnimate>
  )
}

const TermText = Styled.textarea`
  word-break: keep-all;
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  &:focus {
    border: 1px solid #ddd;
  }
`;
const CloseBtn = Styled.button`
  width: 100%;
`;