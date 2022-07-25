import React, { useContext, useMemo } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';
import useStore from '%/useStore';
import DataColumn from './DataColumn';
import DateList from './DateList';
import LeftLabel from './LeftLabel';
import Frame from './Frame';
import { Store } from './Scheduler';

export default function 일() {
  const startTime = useStore((x) => x?.setting?.START_TIME);
  const endTime = useStore((x) => x?.setting?.END_TIME);
  const { active: set, list: data } = useContext(Store);

  const dayList = useMemo(() => {
    let date = new Date(set?.start);
    let _dayList = [];
    _dayList.push(useDate(date, 'date'));
    return _dayList;
  }, [set]);

  const currentHourList = useMemo(() => {
    let tempArr = [];
    let start = Number(startTime?.split(':')[0] ?? 0);
    let end = Number(endTime?.split(':')[0] ?? 0);
    let calc = end - start;
    for (let i = start; i <= start + calc; i++) {
      tempArr.push(i < 10 ? '0' + i : i);
    }
    return tempArr?.map((t) => String(t));
  }, [startTime, endTime]);

  const resultList = useMemo(() => {
    if (!data) return [];

    let validateFilter = data?.map((item) => {
      let startDate = item?.START?.split(' ')[0];
      let endDate = item?.END?.split(' ')[0];
      let startDateObj = new Date(item?.START);
      let endDateObj = new Date(item?.END);
      let setStartObj = new Date(`${startDate} ${startTime}:00`);
      let setEndObj = new Date(`${endDate} ${endTime}:00`);

      if (startDateObj <= setStartObj) {
        startDateObj = setStartObj;
      }
      if (endDateObj >= setEndObj) {
        endDateObj = setEndObj;
      }
      return {
        ...item,
        START: useDate(startDateObj),
        END: useDate(endDateObj),
      };
    });
    validateFilter = validateFilter?.filter((x) => x?.START !== x?.END);

    let result = [];
    dayList?.forEach((item) => {
      let findArr = validateFilter?.filter(
        (x) => x?.START?.split(' ')[0] == item,
      );
      result?.push({ date: item, list: findArr });
    });

    return result;
  }, [data, dayList]);

  return (
    <Container>
      <Head>
        <DateList list={resultList} />
      </Head>
      <Body>
        <LeftLabel currentHourList={currentHourList} />
        <SchedulerContainer>
          {dayList?.map((date, i) => (
            <Column key={date}>
              <Frame
                date={date}
                dayCount={1}
                i={i}
                currentHourList={currentHourList}
              />
              <DataColumn
                currentHourList={currentHourList}
                data={resultList?.find((x) => x?.date === date)}
              />
            </Column>
          ))}
        </SchedulerContainer>
      </Body>
    </Container>
  );
}

const Container = Styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const Head = Styled.section`
  display: flex;
  width: calc(100% - 54px);
  align-self: flex-end;
`;
const Body = Styled.section`
  height: calc(100% - 100px);
  overflow-y: auto;
  position: relative;
  padding-left: 54px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;
const SchedulerContainer = Styled.section`
  display: flex;
  width: 100%;
`;
const Column = Styled.article`
  flex: 1;
  border-right: 1px solid #b9e1dc99;
  position: relative;
  max-width: calc(100% / 1);
  &:first-of-type {
    border-left: 1px solid #b9e1dc99;
  }
  &:last-of-type {
    border-right: none;
  }
`;
