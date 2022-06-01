import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useDate from '%/useDate';
import PageAnimate from '%/PageAnimate';
import Header from './Header';

export default function 스케줄 () {
  const params = useParams();
  const userId = params?.id;
  const [list, setList] = useState([]);
  const [today, setToday] = useState(useDate(new Date(), 'date'));
  const [date, setDate] = useState(new Date());
  const [dayList, setDayList] = useState(['일', '월', '화', '수', '목', '금', '토']);
  const [dateList, setDateList] = useState([]);

  const getList = () => {
    
  }
  const dateInit = (num = 0, _date) => {
    
    getList();
    let tempDate = _date ?? date;
    tempDate.setDate(1);
    tempDate.setMonth(tempDate.getMonth() + 1 + num);
    tempDate.setDate(1);
    tempDate.setDate(tempDate.getDate() - 1);
    let dateCount = tempDate.getDate();
    tempDate.setDate(1);
    let startDay = tempDate.getDay();
    setDate(tempDate);
    calendarInit(startDay, dateCount);
  }
  const calendarInit = (startDay, dateCount) => {
    let arr = [];
    for (let i = 0; i < 42; i++) {
      let d = i - startDay + 1;
      arr.push((i < startDay || d > dateCount) ? null : d); 
    }
    setDateList(arr);
  }

  const dateReturn = useCallback(num => {
    if (!num) return '';
    let result = dateArr[0] + '-' + dateArr[1] + '-' + (num < 10 ? '0' + num : num);
    return result;
  })

  const dateArr = useMemo(() => {
    let y = date.getFullYear();
    let m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    return [y, m];
  });

  useEffect(() => dateInit(0), []);

  return (
    <PageAnimate name='slide-up' style={{ display: 'flex', flexDirection: 'column' }}>
      <Header date={date} setDate={setDate} dateInit={dateInit} />
      <Calendar>
        <DayList>
          {dayList?.map((day, i) => <DayBox key={i}>{day}</DayBox>)}
        </DayList>
        <DateList>
          {dateList?.map((num, i) => (
            <DateBox key={i} className={[dateReturn(num), dateReturn(num) === today ? 'today' : '']}>
              <Num>{num}</Num>
              <List></List>
            </DateBox>
          ))}
        </DateList>
      </Calendar>
    </PageAnimate>
  )
}

const Calendar = Styled.section`
  flex: 1 !important;
  padding: 10px !important;
  display: flex !important;
  flex-direction: column;
`;
const DayList = Styled.div`
  width: 100%;
  height: 30px;
  border: 1px solid #b9e1dc;
`;
const DateList = Styled.div`
  width: 100%;
  flex: 1;
  display: flex !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  flex-wrap: wrap !important;
  border: 1px solid #b9e1dc;
  border-top: none;
`;
const DayBox = Styled.article`
  width: calc(100% / 7);
  min-height: 30px;
  max-height: 30px;
  line-height: 28px;
  text-align: center;
  font-size: 14px;
  border-right: 1px solid #b9e1dc;
  align-self: stretch;
  &:last-of-type {
    border-right: none;
  }
  &:nth-of-type(7n + 1) {
    color: #fc5858;
  }
  &:nth-of-type(7n) {
    color: #6d6df7;
  }
`;
const DateBox = Styled.article`
  width: calc(100% / 7);
  min-height: 60px;
  align-self: stretch;
  padding: 2px 6px 6px;
  border-right: 1px solid #b9e1dc;
  border-bottom: 1px solid #b9e1dc;
  display: flex;
  flex-direction: column;

  &:nth-of-type(7n + 1) > span {
    color: #fc5858;
  }
  &:nth-of-type(7n) > span {
    color: #6d6df7;
  }
  &:nth-of-type(7n) {
    border-right: none;
  }
  &:nth-of-type(35) ~ article {
    border-bottom: none;
  }
  &.today {
    box-shadow: 0 0 4px #00ada9 inset;
  }
`;
const Num = Styled.span`
  width: 100%;
  height: 30px;
  font-size: 13px;
`;
const List = Styled.ul`
  flex: 1;
  overflow: auto;
`;