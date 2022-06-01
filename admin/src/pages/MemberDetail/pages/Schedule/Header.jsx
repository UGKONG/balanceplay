import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useDate from '%/useDate';
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export default function 스케줄해더 ({ date, setDate, dateInit }) {

  const dateString = useMemo(() => {
    let [Y, M] = useDate(date, 'date')?.split('-');
    return (Y + '년 ' + M + '월');
  });

  const todayClick = () => {
    setDate(new Date());
    dateInit(0, new Date);
  }

  return (
    <Wrap>
      <Left>
        
      </Left>
      {date && (
        <Center>
          <PrevBtn onClick={() => dateInit(-1)} />
          <DateString>{dateString}</DateString>
          <NextBtn onClick={() => dateInit(+1)} />
        </Center>
      )}
      <Right>
        <TodayBtn onClick={todayClick}>오늘</TodayBtn>
      </Right>
    </Wrap>
  )
}

const Wrap = Styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 10px;
`;
const Left = Styled.section`
  width: 100px;
`;
const Center = Styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #008a87;
`;
const Right = Styled.section`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const DateString = Styled.span`
  font-weight: 700;
  font-size: 18px;
  margin: 0 5px;
`;
const PrevBtn = Styled(BiChevronLeft)`
  width: 26px;
  height: 26px;
  padding-top: 2px;
  border-radius: 50%;
  cursor: pointer;
  color: #008a879e;
  &:hover {
    color: #008a87;
  }
`;
const NextBtn = Styled(BiChevronRight)`
  width: 26px;
  height: 26px;
  padding-top: 2px;
  border-radius: 50%;
  cursor: pointer;
  color: #008a879e;
  &:hover {
    color: #008a87;
  }
`;
const TodayBtn = Styled.button`
  font-size: 12px;
  padding: 0 8px;
  height: 26px;
  line-height: 24px;
`;