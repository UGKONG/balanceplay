import React, { useEffect } from 'react';
import Styled from 'styled-components';

export default function 결과프로그래스 ({ width, data }) {

  useEffect(() => console.log(data), []);

  return (
    <Container style={{ width }}>
      {data?.map(item => (
        <ProgressItem key={item?.ID}>
          <Name>{item?.NAME ?? '-'}</Name>
          <Point>{item?.POINT ?? 0}점/{item?.MAX_POINT ?? 0}점</Point>
          <ProgressBar>
            <Bar>
              <Grade>{item?.GRADE ?? '-'}</Grade>
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
  justify-content: space-around;
  padding-right: 50px;
  overflow: auto;
`
const ProgressItem = Styled.div`
  min-height: 60px;
  padding-bottom: 14px;
  display: flex;
  align-items: center;
`
const Name = Styled.p`
  width: 170px;
  white-space: nowrap;
  text-align: left;
  color: #00ac99;
  font-weight: 500;
  padding: 0 4px;
`
const Point = Styled.p`
  width: 120px;
  text-align: center;
  white-space: nowrap;
  color: #008a87;
  font-weight: 500;
  letter-spacing: 2px;
  font-size: 14px;
`
const ProgressBar = Styled.div`
  width: 100%;
  border-radius: 10px;
  background-color: #eee;
  border: 1px solid #ddddddaa;
`
const Bar = Styled.div`
  width: ${x => x?.width ?? 20}%;
  height: 10px;
  border-radius: 10px;
  background-color: #00ada9dd;
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