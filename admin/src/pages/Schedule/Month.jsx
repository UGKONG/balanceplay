import React, { useMemo, useRef } from "react";
import Styled from "styled-components";

export default function 월 ({ set, data }) {
  const dayList = useRef(['일','월','화','수','목','금','토']);
  
  const init = useMemo(() => {
    let dateList = [];
    let startDay = (new Date(set?.start))?.getDay();
    let endDay = (new Date(set?.end))?.getDay();
    let count = Number(set?.end?.split('-')[2]);
    let calc = startDay + (6 - endDay) + count;
    for (let i = 0; i < calc; i ++) {
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
  }, [set]);

  const filterCount = date => (
    (data?.filter(
      x => x?.START?.split(' ')[0] === set?.start?.slice(0, 8) + (date < 10 ? '0' + date : date)
    ) ?? [])?.length ?? 0
  );

  return (
    <Container>
      {dayList?.current?.map(item => (
        <DayBox key={item}>{item}</DayBox>
      ))}
      {init?.dateList?.map((item, i) => (
        <DateBox key={i} rowCount={init?.rowCount}>
          <Head>
            {item && <span>{item}</span>}
            {item && filterCount(item) > 0 && <span>{filterCount(item)}개</span>}
          </Head>
          <Body>
            {data?.filter(x => x?.START?.split(' ')[0] === set?.start?.slice(0, 8) + (item < 10 ? '0' + item : item))?.map(item => (
              <Box key={item?.ID}>
                {item?.CALENDAR_NAME}/{item?.ROOM_NAME}/{item?.TEACHER_NAME}/{item?.TITLE}
              </Box>
            ))}
          </Body>
        </DateBox>
      ))}
    </Container>
  )
}

const Container = Styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
`
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
`
const DateBox = Styled.article`
  min-width: calc(100% / 7);
  height: calc((100% - 30px) / ${x => x?.rowCount});
  flex: 1;
  padding: 6px 8px;
  border-right: 1px solid #b9e1dc99;
  border-bottom: 1px solid #b9e1dc99;
  font-size: 12px;
  color: #555;
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
  &:nth-of-type(${x => x?.rowCount * 7 - 7}) ~ & {
    border-bottom: none;
  }
`
const Head = Styled.p`
  height: 20px;
  display: flex;
  justify-content: space-between;
  & > span:first-of-type {
    font-size: 14px;
    font-weight: 500;
  }
`
const Body = Styled.ul`
  width: 100%;
  height: calc(100% - 20px);
  padding-top: 6px;
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