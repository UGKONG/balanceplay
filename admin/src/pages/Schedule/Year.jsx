import React, { useCallback, useRef, useContext } from 'react';
import Styled from 'styled-components';
import YearBox from './YearBox';
import { Store } from './Scheduler';

export default function 년({}) {
  const yearList = useRef(new Array(12).fill(null));
  const { list: data } = useContext(Store);

  const list = useCallback(
    (num) => {
      let i = num + 1;
      return data?.filter((x) => Number(x?.START?.split('-')[1]) === i);
    },
    [data],
  );

  return (
    <Container>
      {yearList?.current?.map((d, i) => (
        <YearContainer key={i}>
          <YearTitle count={list(i)?.length}>{i + 1}월</YearTitle>
          <ScheduleList>
            {list(i)?.map((item) => (
              <YearBox key={item?.ID} data={item} />
            ))}
          </ScheduleList>
        </YearContainer>
      ))}
    </Container>
  );
}

const Container = Styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;
const YearContainer = Styled.div`
  min-width: calc(100% / 6);
  height: 50%;
  flex: 1;
  border-bottom: 1px solid #b9e1dc99;
  display: block !important;
  &:nth-of-type(6) ~ & {
    border-bottom: none;
  }
  &:nth-of-type(6), &:nth-of-type(12) {
     & > p, & > ul {
       border-right: none;
     }
  }
`;
const YearTitle = Styled.p`
  height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  background-color: #b9e1dc99;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #fff;
  position: relative;
  
  &::after {
    content: '${(x) => x?.count ?? 0}개';
    display: ${(x) => (x?.count === 0 ? 'none' : 'block')};
    position: absolute;
    bottom: 2px;
    right: 4px;
    font-size: 10px;
    color: #666;
  }
`;
const ScheduleList = Styled.ul`
  border-right: 1px solid #b9e1dc99;
  height: calc(100% - 30px);
  padding: 6px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
`;
