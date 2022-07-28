import React, { useCallback, useContext, useMemo, useRef } from 'react';
import Styled from 'styled-components';
import MonthBox from './MonthBox';
import { Store } from './Scheduler';
import useDate from '%/useDate';
import useAlert from '%/useAlert';

export default function 월() {
  const dayList = useRef(['일', '월', '화', '수', '목', '금', '토']);
  const { active, list: data, calendarList, setWriteInfo } = useContext(Store);

  const init = useMemo(() => {
    let dateList = [];
    let startDay = new Date(active?.start)?.getDay();
    let endDay = new Date(active?.end)?.getDay();
    let count = Number(active?.end?.split('-')[2]);
    let calc = startDay + (6 - endDay) + count;
    for (let i = 0; i < calc; i++) {
      let result = null;
      if (i < startDay) {
        result = null;
      } else if (i - startDay + 1 > count) {
        result = null;
      } else {
        result = i - startDay + 1;
      }
      dateList?.push(result);
    }
    return { rowCount: dateList?.length / 7, dateList };
  }, [active]);

  const filterCount = (date) => {
    let _date = date < 10 ? '0' + date : date;
    let result = data?.filter(
      (x) => x?.START?.split(' ')[0] === active?.start?.slice(0, 8) + _date,
    );
    return result?.length ?? 0;
  };

  const resultList = useCallback(
    (item) => {
      let _date = item < 10 ? '0' + item : item;
      let result = data?.filter(
        (x) => x?.START?.split(' ')[0] === active?.start?.slice(0, 8) + _date,
      );
      return result;
    },
    [active, data],
  );

  const createSchedule = (date) => {
    if (!date) return;
    if (active?.calendar === 0) {
      return useAlert.info('알림', '캘린더를 선택해주세요.');
    }

    let today = new Date();
    today?.setHours(today?.getHours() + 1);
    today?.setMinutes(0);
    today?.setSeconds(0);
    today?.setMilliseconds(0);
    let START_TIME = useDate(today, 'time');
    today?.setHours(today?.getHours() + 1);
    let END_TIME = useDate(today, 'time');

    let findCalendar = calendarList?.find((x) => x?.ID === active?.calendar);
    let CALENDAR_TYPE = findCalendar ? findCalendar?.TYPE : 0;

    let START_DATE = active?.start?.slice(0, 8);
    let END_DATE = START_DATE + (Number(date) < 10 ? '0' + date : date);
    START_DATE = START_DATE + (Number(date) < 10 ? '0' + date : date);

    setWriteInfo({
      CALENDAR_TYPE,
      START_DATE,
      END_DATE,
      START_TIME,
      END_TIME,
    });
  };

  return (
    <Container>
      {dayList?.current?.map((item) => (
        <DayBox key={item}>{item}</DayBox>
      ))}
      {init?.dateList?.map((item, i) => (
        <DateBox
          key={i}
          rowCount={init?.rowCount}
          className={item ? 'true' : 'false'}
          onClick={() => createSchedule(item)}
        >
          <Head>
            {item && <span>{item}</span>}
            {item && filterCount(item) > 0 && (
              <span>{filterCount(item)}개</span>
            )}
          </Head>
          <Body>
            {resultList(item)?.map((item, i) => (
              <MonthBox key={i} data={item} />
            ))}
          </Body>
        </DateBox>
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
  align-content: flex-start;
`;
const DayBox = Styled.div`
  display: block !important;
  min-width: calc(100% / 7);
  line-height: 28px;
  height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  background-color: #b9e1dc99;
  border-right: 1px solid #fff;
  &:first-of-type {
    color: #f00;
  }
  &:last-of-type {
    color: #00f;
    border-right: none;
  }
`;
const DateBox = Styled.article`
  min-width: calc(100% / 7);
  height: calc((100% - 30px) / ${(x) => x?.rowCount});
  flex: 1;
  padding: 6px 8px;
  border-right: 1px solid #b9e1dc99;
  border-bottom: 1px solid #b9e1dc99;
  font-size: 12px;
  color: #555;
  &.true {
    cursor: pointer;
  }
  &:nth-of-type(7n + 1) {
    & > p > span:first-of-type {
      color: #f00;
    }
  }
  &:nth-of-type(7n) {
    border-right: none;
    & > p > span:first-of-type {
      color: #00f;
    }
  }
  &:nth-of-type(${(x) => x?.rowCount * 7 - 7}) ~ & {
    border-bottom: none;
  }
  &:hover > p > span {
    text-decoration: underline;
  }
`;
const Head = Styled.p`
  height: 20px;
  display: flex;
  justify-content: space-between;
  & > span:first-of-type {
    font-size: 14px;
    font-weight: 500;
  }
`;
const Body = Styled.section`
  width: 100%;
  height: calc(100% - 20px);
  padding-top: 6px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
`;
