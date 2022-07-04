import React, { useEffect } from 'react';
import Styled from 'styled-components';

export default function 결과프로그래스 ({ data }) {

  const percent = (now, all) => now / all * 100;

  return (
    <Container>
      {data?.map(item => (
        <ProgressItem key={item?.ID}>
          <Name>{item?.NAME ?? '-'}</Name>
          <Point>{item?.POINT ?? 0}점/{item?.MAX_POINT ?? 0}점</Point>
          <ProgressBar>
            <Bar width={percent(item?.POINT, item?.MAX_POINT)}>
              {item?.POINT > 0 && <Grade>{item?.GRADE ?? '-'}</Grade>}
            </Bar>
          </ProgressBar>
        </ProgressItem>
      ))}
    </Container>
  )
}

const Container = Styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`
const ProgressItem = Styled.div`
  min-height: 60px;
  padding-bottom: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`
const Name = Styled.p`
  min-width: 130px;
  white-space: nowrap;
  text-align: left;
  color: #00ac99;
  font-weight: 500;
  padding: 0 4px;
`
const Point = Styled.p`
  min-width: 80px;
  text-align: left;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 2px;
  color: #008a87;
`
const ProgressBar = Styled.div`
  width: 100%;
  border-radius: 10px;
  background-color: #eee;
  border: 1px solid #ddddddaa;
`
const Bar = Styled.div`
  width: ${x => x?.width ?? 0}%;
  height: 10px;
  border-radius: 10px;
  background-color: #00ada9dd;
  background-image: linear-gradient(45deg, #00ada9dd, #48bd79dd);
  position: relative;
`
const Grade = Styled.p`
  white-space: nowrap;
  padding: 0 30px;
  font-size: 11px;
  color: #888;
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  transform: translateX(50%);
`