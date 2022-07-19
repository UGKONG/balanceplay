import React, { useCallback, useState, useEffect, useMemo } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';
import useStore from '%/useStore';

export default function 주({ set, data }) {
  const startTime = useStore((x) => x?.setting?.START_TIME);
  const endTime = useStore((x) => x?.setting?.END_TIME);
  const colorList = useStore((x) => x?.colorList);

  const list = useMemo(() => {
    if (!data) return [];
    let filter = data?.filter((x) => {
      let currentDate = x?.END?.split(' ')[0];
      let timeValidate1 =
        new Date(x?.START) >= new Date(currentDate + ' ' + startTime + ':00');
      let timeValidate2 =
        new Date(x?.END) <= new Date(currentDate + ' ' + endTime + ':00');
      return timeValidate1 && timeValidate2;
    });
    return filter;
  }, [data]);

  const todayScheduleList = (date) =>
    list?.filter((x) => x?.START?.split(' ')[0] === date);

  const dayList = useMemo(() => {
    let date = new Date(set?.start);
    let _dayList = [];
    _dayList.push(useDate(date, 'date'));
    for (let i = 0; i < 6; i++) {
      date.setDate(date.getDate() + 1);
      _dayList.push(useDate(date, 'date'));
    }
    return _dayList;
  }, [set]);

  const timeSettingInitData = useMemo(() => {
    let tempArr = [];
    let start = Number(startTime?.split(':')[0] ?? 0);
    let end = Number(endTime?.split(':')[0] ?? 0);
    let calc = end - start;
    for (let i = start; i <= start + calc; i++) {
      tempArr.push(i < 10 ? '0' + i : i);
    }
    return tempArr;
  }, [startTime, endTime]);

  const positionCalc = useCallback(
    (item, i) => {
      let itemDate = item?.START?.split(' ')[0];
      let rowCount = timeSettingInitData?.length;
      let [settingStartH, settingStartM] = startTime
        ?.split(':')
        ?.map((x) => Number(x));

      // TOP, HEIGHT 로직
      let [startH, startM] = item?.START?.split(' ')[1]
        ?.split(':')
        ?.map((x) => Number(x));
      let [endH, endM] = item?.END?.split(' ')[1]
        ?.split(':')
        ?.map((x) => Number(x));
      let startHCalc = (startH - settingStartH) * 100;
      let startMCalc = (((startM - settingStartM) / 60) * 100) / rowCount;
      let endHCalc = (endH - startH - (startM > endM ? 1 : 0)) * 100;
      let mCalc = endM - startM;
      let endMCalc =
        (((mCalc >= 0 ? mCalc : 60 - Math.abs(mCalc)) / 60) * 100) / rowCount;

      // LEFT, WIDTH 로직
      let sameTimeScheduleArr = [];
      let todayList = list?.filter((x) => x?.START?.split(' ')[0] === itemDate);

      todayList?.forEach((item, i) => {
        let start = new Date(item?.START);
        let end = new Date(item?.END);

        let filter = todayList
          ?.filter((x) => {
            let startValidate = new Date(x?.END) < start;
            let endValidate = new Date(x?.START) > end;
            return startValidate || endValidate;
          })
          ?.map((t) => ({ ...t }));

        if (filter?.length === 0) {
          sameTimeScheduleArr?.push([{ ...item }]);
        } else {
          sameTimeScheduleArr?.push(filter);
        }
      });

      let jsonArr = [];
      sameTimeScheduleArr?.forEach((item) => {
        let json = JSON.stringify(item);
        let find = jsonArr?.find((x) => x === json);
        if (!find) jsonArr?.push(json);
      });

      let result = [];
      jsonArr?.forEach((item, i) => {
        let temp = JSON.parse(item);
        temp?.forEach((t) => result?.push({ ...t, GROUP: i }));
      });
      result?.sort((a, b) => new Date(a?.START) - new Date(b?.START));

      let findGroupId = result?.find((x) => x?.ID === item?.ID)?.GROUP;
      let sameGroupList = result?.filter((x) => x?.GROUP === findGroupId);
      let findOrder = sameGroupList?.findIndex((x) => x?.ID === item?.ID);

      let widthCalc = 90 / sameGroupList?.length;
      let leftCalc = widthCalc * findOrder;

      return {
        top: `calc(${startHCalc}px + ${startMCalc}%)`,
        height: `calc(${endHCalc}px + ${endMCalc}%)`,
        width: `calc(${widthCalc}%)`,
        left: `${leftCalc}%`,
      };
    },
    [timeSettingInitData, startTime, endTime, list],
  );

  const BoxMemo = useCallback(
    ({ date }) => {
      let _list = todayScheduleList(date);
      if (_list?.length === 0) return null;

      _list?.sort((a, b) => new Date(a?.START) - new Date(b?.START));

      return _list?.map((item, i) => (
        <Box key={item?.ID} style={positionCalc(item, i)}>
          <article style={{ backgroundColor: colorList[item?.ROOM_ID] }}>
            {item?.ID}/{item?.CALENDAR_NAME}/{item?.ROOM_NAME}/
            {item?.TEACHER_NAME}/{item?.TITLE}
          </article>
        </Box>
      ));
    },
    [data],
  );

  const click = (date, time) => {
    console.log(date, time);
  };

  return (
    <Container>
      <Head>
        {dayList?.map((item) => (
          <DateItem key={item}>
            <p>
              {item?.slice(0, 7)}
              <span>{item?.split('-')[2]}</span>
            </p>
            <span>{todayScheduleList(item)?.length ?? 0}개</span>
          </DateItem>
        ))}
      </Head>
      <Body>
        <LabelContainer>
          {timeSettingInitData?.map((time, i) => (
            <div key={time}>
              <span>
                <small>{Number(time) < 12 ? 'AM' : 'PM'} </small>
                {time}:00
              </span>
            </div>
          ))}
        </LabelContainer>
        <SchedulerContainer>
          {dayList?.map((date) => (
            <Column key={date}>
              {/* 스케줄 보더 틀 */}
              {timeSettingInitData?.map((time) => (
                <Row key={time}>
                  <div onClick={() => click(date, time + ':00:00')} />
                  <div onClick={() => click(date, time + ':30:00')} />
                </Row>
              ))}
              {/* 실제 스케줄 */}
              <BoxMemo date={date} />
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
`;
const Head = Styled.section`
  display: flex;
  padding-left: 54px;
  background-color: #b9e1dc99;
`;
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
      background-color: #e1dfdf59;
    }
    & > span {
      display: block;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  }
`;
const Column = Styled.article`
  flex: 1;
  border-right: 1px solid #b9e1dc99;
  position: relative;
  max-width: calc(100% / 7);
  &:first-of-type {
    border-left: 1px solid #b9e1dc99;
  }
  &:last-of-type {
    border-right: none;
  }
`;
const Row = Styled.article`
  height: 100px;
  font-size: 12px;
  color: #555;
  border-bottom: 1px solid #b9e1dc99;
  &:last-of-type {
    border-bottom: none;
    background-color: #e1dfdf59;
  }
  &:not(&:last-of-type) > div {
    width: 100%;
    height: 50%;
    background-color: transparent;
    cursor: pointer;
    &:first-of-type {
      border-bottom: 1px dashed #e8e6e6;
    }
    &:hover {
      background-color: #b9e1dc40;
    }
  }
`;
const Box = Styled.div`
  position: absolute;
  padding: 1px;
  overflow: hidden;
  min-height: 50px;
  filter: opacity(0.9);
  transition: .2s;
  & > article {
    width: 100%;
    height: 100%;
    padding: 6px;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    box-shadow: 1px 1px #55555555;
    cursor: zoom-in;
  }
  &:hover {
    filter: opacity(1);
  }
`;
