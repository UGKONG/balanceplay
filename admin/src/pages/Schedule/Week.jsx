import React, { useEffect, useMemo, useState } from "react";
import Styled from "styled-components";
import useDate from '%/useDate';
import useStore from '%/useStore';

export default function 주 ({ set, data }) {
  const startTime = useStore(x => x?.setting?.START_TIME);
  const endTime = useStore(x => x?.setting?.END_TIME);
  const [dayList, setDayList] = useState([]);
  
  const init = () => {
    let date = new Date(set?.start);
    let _dayList = [];
    _dayList.push(useDate(date, 'date'));
    for (let i = 0; i < 6; i ++) {
      date.setDate(date.getDate() + 1);
      _dayList.push(useDate(date, 'date'));
    }
    setDayList(_dayList);
  }

  const filterCount = date => (
    (data?.filter(x => x?.START?.split(' ')[0] === date) ?? [])?.length
  );
  
  const processTimeList = useMemo(() => {
    let tempArr = [];
    let start = Number(startTime?.split(':')[0] ?? 0);
    let end = Number(endTime?.split(':')[0] ?? 0);
    let calc = end - start;
    for (let i = start; i <= start + calc; i ++) {
      tempArr.push(i < 10 ? '0' + i : i);
    }
    return tempArr;
  }, [startTime, endTime]);

  useEffect(init, [set]);

  return (
    <Container>
      <Head>
        {dayList?.map(item => (
          <DateItem key={item}>
            <p>
              {item?.slice(0, 7)}
              <span>{item?.split('-')[2]}</span>
            </p>
            <span>{filterCount(item)}개</span>
          </DateItem>
        ))}
      </Head>
      <Body>
        <SchedulerContainer>
          {dayList?.map(date => (
            <Column key={date}>
              {processTimeList?.map(time => (
                <Row key={time}>
                  {/* 시간 {(time < 10 ? '0' + time : time)}:00 */}
                  {data?.filter(x => x?.START === date + ' ' + time + ':00:00')?.map(item => (
                    <Box key={item?.ID}>
                      {item?.CALENDAR_NAME}/{item?.ROOM_NAME}/{item?.TEACHER_NAME}/{item?.TITLE}
                    </Box>
                  ))}
                </Row>
              ))}
            </Column>
          ))}
        </SchedulerContainer>
      </Body>
    </Container>
  )
}

const Container = Styled.section`
  width: 100%;
  height: 100%;
  position: relative;
`
const Head = Styled.section`
  display: flex;
`
const DateItem = Styled.article`
  flex: 1;
  border-right: 1px solid #fff;
  background-color: #b9e1dc;

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
  }

  &:last-of-type {
    border-right: none;
  }
`
const Body = Styled.section`
  height: calc(100% - 100px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`
const SchedulerContainer = Styled.section`
  display: flex;
  width: 100%;
`
const Column = Styled.article`
  flex: 1;
  border-right: 1px solid #b9e1dc;
  &:last-of-type {
    border-right: none;
  }
`
const Row = Styled.article`
  height: 100px;
  padding: 6px;
  font-size: 12px;
  color: #555;
  border-bottom: 1px solid #b9e1dc;
  overflow: auto;
  &:last-of-type {
    border-bottom: none;
  }
`
const Box = Styled.div`
  padding: 6px;
  border-radius: 3px;
  color: #fff;
  background-color: #519a92;
  box-shadow: 1px 2px 4px #55555520;
  margin-bottom: 6px;
  &:last-of-type {
    margin-bottom: 0;
  }
`