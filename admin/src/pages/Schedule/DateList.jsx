import React, { useCallback } from 'react';
import Styled from 'styled-components';

export default function 주_날짜리스트({ list }) {
  const dateSlice = useCallback((item) => {
    let [y, m, d] = item?.date?.split('-');
    return { y, m, d };
  }, []);

  return list?.map((item) => (
    <Container key={item?.date}>
      <p>
        {dateSlice(item)?.y}-{dateSlice(item)?.m}
        <span>{dateSlice(item)?.d}</span>
      </p>
      <span>{item?.list?.length}개</span>
    </Container>
  ));
}

const Container = Styled.article`
  flex: 1;
  border-right: 1px solid #fff;
  background-color: #b9e1dc99;

  & > p {
    flex: 1;
    height: 76px;
    font-size: 12px;
    color: #555;
    border-bottom: 1px solid #fff;
    padding: 8px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    & > span {
      font-size: 24px;
      font-weight: 700;
      color: #222;
      display: block;
    }
  }
  & > span {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 24px;
    padding: 0 8px;
    font-size: 11px;
    letter-spacing: 1px;
    color: #2a897d;
    background-color: #d5e6e4;
  }


  &:first-of-type {
    border-left: 1px solid #fff;
    & > p > span {
      color: #fe5a5a;
    }
  }
  &:last-of-type {
    border-right: none;
    & > p > span {
      color: #4545f7;
    }
  }
`;
