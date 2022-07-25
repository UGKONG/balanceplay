import React, { useCallback, useRef } from 'react';
import Styled from 'styled-components';

export default function 주_날짜리스트({ list }) {
  const dayList = useRef(['일', '월', '화', '수', '목', '금', '토', '일']);

  const dateSlice = useCallback((item) => {
    let [Y, M, D] = item?.date?.split('-');
    let d = new Date(item?.date);
    d = d.getDay();
    let c = d === 0 ? '#fe5a5a' : d === 6 ? '#4545f7' : 'inherit';
    d = dayList?.current[d];
    return { Y, M, D, d, c };
  }, []);

  return list?.map((item) => (
    <Container key={item?.date}>
      <Header>
        <YM>
          {dateSlice(item)?.Y}-{dateSlice(item)?.M}
        </YM>
        <DD style={{ color: dateSlice(item)?.c }}>
          {dateSlice(item)?.D}
          <D>{dateSlice(item)?.d}</D>
        </DD>
      </Header>
      <Footer>{item?.list?.length}개</Footer>
    </Container>
  ));
}

const Container = Styled.article`
  flex: 1;
  border-right: 1px solid #fff;
  background-color: #b9e1dc99;

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
const Header = Styled.div`
  flex: 1;
  height: 76px;
  color: #555;
  border-bottom: 1px solid #fff;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start !important;
`;
const Footer = Styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 24px;
  padding: 0 8px;
  font-size: 11px;
  letter-spacing: 1px;
  color: #2a897d;
  background-color: #d5e6e4;
`;
const YM = Styled.span`
  font-size: 14px;
`;
const DD = Styled.p`
  width: 100%;
  font-size: 24px;
  font-weight: 700;
  color: #222;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const D = Styled.span`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;
