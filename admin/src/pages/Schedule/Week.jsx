import React, { useCallback, useEffect, useMemo } from "react";
import Styled from "styled-components";
import useDate from '%/useDate';
import useStore from '%/useStore';

export default function 주 ({ set, data }) {
  const startTime = useStore(x => x?.setting?.START_TIME);
  const endTime = useStore(x => x?.setting?.END_TIME);

  const filterSchedule = useCallback(date => {
    if (!data || !date) return [];
    return data?.filter(x => {
      let currentDate = x?.END?.split(' ')[0];
      let timeValidate1 = new Date(x?.START) >= new Date(currentDate + ' ' + startTime + ':00');
      let timeValidate2 = new Date(x?.END) <= new Date(currentDate + ' ' + endTime + ':00');
      let dateValidate = x?.START?.split(' ')[0] === date;
      return timeValidate1 && timeValidate2 && dateValidate;
    });
  }, [data]);

  const filterCount = date => filterSchedule(date)?.length ?? 0;

  const dayList = useMemo(() => {
    let date = new Date(set?.start);
    let _dayList = [];
    _dayList.push(useDate(date, 'date'));
    for (let i = 0; i < 6; i ++) {
      date.setDate(date.getDate() + 1);
      _dayList.push(useDate(date, 'date'));
    }
    return _dayList;
  }, [set]);
  
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

  const topHeightCalc = useCallback(item => {
    let top = 0;
    let height = 0;
    let [startH, startM] = item?.START?.split(' ')[1]?.split(':');
    let [endH, endM] = item?.END?.split(' ')[1]?.split(':');
    let startHCalc = (Number(startH) - Number(startTime?.split(':')[0])) * 100;
    let startMCalc = (Number(startM) - Number(startTime?.split(':')[1])) / 60 * 100 / processTimeList?.length;
    let endHCalc = (Number(endH) - Number(startH) - (Number(startM) > Number(endM) ? 1 : 0)) * 100;
    let mCalc = Number(endM) - Number(startM);
    let endMCalc = (mCalc >= 0 ? mCalc : 60 - Math.abs(mCalc)) / 60 * 100 / processTimeList?.length;

    top = `calc(${startHCalc}px + ${startMCalc}%)`;
    height = `calc(${endHCalc}px + ${endMCalc}%)`;

    return { top, height };
  }, [processTimeList, startTime, endTime]);

  const BoxMemo = useCallback(({ date }) => {
    let _list = filterSchedule(date);
    if (_list.length === 0) return null;
    
    return _list?.map(item => (
      <Box key={item?.ID} style={topHeightCalc(item)}>
        {item?.CALENDAR_NAME}/{item?.ROOM_NAME}/{item?.TEACHER_NAME}/{item?.TITLE}
      </Box>
    ))
  }, [data]);

  useEffect(() => data?.length !== 0 && console.log(data[1]), [data]);

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
        <LabelContainer>
          {processTimeList?.map((time, i) => (
            <div key={time}>
              <span>
                <small>{Number(time) < 12 ? 'AM' : 'PM'} </small>
                {time}:00
              </span>
            </div>
          ))}
        </LabelContainer>
        <SchedulerContainer>
          {dayList?.map(date => (
            <Column key={date}>
              {/* 스케줄 보더 틀 */}
              {processTimeList?.map(time => <Row key={time} />)}
              {/* 실제 스케줄 */}
              <BoxMemo date={date} />
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
  padding-left: 54px;
  background-color: #b9e1dc99;
`
const DateItem = Styled.article`
  flex: 1;
  border-right: 1px solid #fff;

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
`
const Body = Styled.section`
  height: calc(100% - 100px);
  overflow-y: auto;
  position: relative;
  padding-left: 54px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`
const SchedulerContainer = Styled.section`
  display: flex;
  width: 100%;
`
const LabelContainer = Styled.section`
  position: absolute;
  top: 0;
  left: 0;
  & > div {
    display: ${'block'} !important;
    width: 54px;
    height: 100px;
    border-bottom: 1px solid #b9e1dc99;
    &:last-of-type {
      border-bottom: none;
      background-color: #e1e1e1;
    }
    & > span {
      display: block;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  }
`
const Column = Styled.article`
  flex: 1;
  border-right: 1px solid #b9e1dc99;
  position: relative;
  &:first-of-type {
    border-left: 1px solid #b9e1dc99;
  }
  &:last-of-type {
    border-right: none;
  }
`
const Row = Styled.article`
  height: 100px;
  /* padding: 3px; */
  font-size: 12px;
  color: #555;
  border-bottom: 1px solid #b9e1dc99;
  &:last-of-type {
    border-bottom: none;
    background-color: #e1e1e1;
  }
`
const Box = Styled.div`
  position: absolute;
  left: 0;
  top: 0;
  padding: 6px;
  border-radius: 5px;
  color: #fff;
  background-color: #519a92;
  box-shadow: 1px 2px 4px #55555520;
  overflow: hidden;
  font-size: 12px;
  min-height: 50px;
  align-items: flex-start !important;
  &:last-of-type {
    margin-bottom: 0;
  }
`