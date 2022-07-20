import React, { useCallback } from 'react';
import Styled from 'styled-components';

export default function 스케줄라벨({ currentHourList }) {
  const format = useCallback((h) => {
    let numH = Number(h);
    let num = numH > 12 ? numH - 12 : numH;
    let ko = numH >= 12 ? 'PM' : 'AM';
    return { ko, num };
  }, []);

  return (
    <Container>
      {currentHourList?.map((time) => (
        <Box key={time}>
          <span>
            <small>{format(time)?.ko}</small>
            <span>{format(time)?.num}:00</span>
          </span>
        </Box>
      ))}
    </Container>
  );
}

const Container = Styled.section`
  position: absolute;
  top: 0;
  left: 0;
`;

const Box = Styled.article`
  width: 54px;
  height: 100px;
  /* border-bottom: 1px solid #b9e1dc99; */
  &:last-of-type {
    border-bottom: none;
    /* background-color: #e1dfdf59; */
  }
  & > span {
    display: block;
    font-size: 12px;
    color: #666;
    text-align: center;
    transform: translateY(-50%);
    text-align: right;
    padding: 0 4px;
    line-height: 12px;
    & > small {
      font-size: 12px;
    }
    & > span {
      display: block;
      font-size: 14px;
      font-weight: 500;
    }
  }
`;
