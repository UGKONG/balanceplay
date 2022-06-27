import React, { useMemo } from "react";
import Styled from 'styled-components';

export default function ProgressContainer ({ now = 0, all = 0 }) {

  const calc = useMemo(() => {
    if (all === 0) return { originalPercent: 0, percent: 0 };
    let originalPercent = now / all * 100;
    let percent = Math.round(originalPercent);
    return { originalPercent, percent };
  }, [now, all]);
  
  return (
    <Container>
      <p>전체 답변 진행율: {all} 중 {now} 완료 ({calc.percent}%)</p>
      <div><span style={{ width: calc.originalPercent + '%' }} /></div>
    </Container>
  )
};

const Container = Styled.section`
  height: 36px;
  overflow: hidden;
  margin-bottom: 10px;
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