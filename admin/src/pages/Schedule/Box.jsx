import React, { useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';
import useStore from '%/useStore';

export default function 스케줄박스({ data, currentHourList, widthLeft }) {
  if (!data) return null;

  const colorList = useStore((x) => x?.colorList);
  const currentStartTime = useStore((x) => x?.setting?.START_TIME);
  const currentEndTime = useStore((x) => x?.setting?.END_TIME);
  const { ID, START_DATE, END_DATE, START_TIME, END_TIME } = useMemo(
    () => ({
      ID: data?.ID,
      START_DATE: data?.START?.split(' ')[0],
      END_DATE: data?.END?.split(' ')[0],
      START_TIME: data?.START?.split(' ')[1],
      END_TIME: data?.END?.split(' ')[1],
    }),
    [data],
  );

  const heightTop = useMemo(() => {
    let rowCount = currentHourList?.length;
    let [currentH, currentM] = currentStartTime?.split(':');
    [currentH, currentM] = [currentH, currentM]?.map((x) => Number(x));
    let [startH, startM] = START_TIME?.split(':')?.map((x) => Number(x));
    let [endH, endM] = END_TIME?.split(':')?.map((x) => Number(x));
    let startHCalc = (startH - currentH) * 100;
    let startMCalc = (((startM - currentM) / 60) * 100) / rowCount;
    let endHCalc = (endH - startH - (startM > endM ? 1 : 0)) * 100;
    let mCalc = endM - startM;
    mCalc = (mCalc >= 0 ? mCalc : 60 - Math.abs(mCalc)) / 60;
    let endMCalc = (mCalc * 100) / rowCount;

    return {
      top: `calc(${startHCalc}px + ${startMCalc}%)`,
      height: `calc(${endHCalc}px + ${endMCalc}%)`,
    };
  }, [data]);

  const background = useMemo(
    () => ({
      backgroundColor: colorList[data?.ROOM_ID],
    }),
    [data],
  );

  return (
    <Container key={ID} style={{ ...heightTop, widthLeft }}>
      <article style={background}>{ID}</article>
    </Container>
  );

  // const positionCalc = useCallback(
  //   (item) => {
  //     let itemDate = item?.START?.split(' ')[0];
  //     let rowCount = timeSettingInitData?.length;
  //     let [settingStartH, settingStartM] = startTime
  //       ?.split(':')
  //       ?.map((x) => Number(x));

  //     // LEFT, WIDTH 로직
  //     let sameTimeScheduleArr = [];
  //     let todayList = list?.filter((x) => x?.START?.split(' ')[0] === itemDate);
  //     console.log(list);
  //     todayList?.forEach((item, i) => {
  //       let start = new Date(item?.START);
  //       let end = new Date(item?.END);

  //       let filter = todayList
  //         ?.filter((x) => {
  //           let validate1 = new Date(x?.END) > start;
  //           let validate2 = new Date(x?.START) <= start;
  //           let validate3 = new Date(x?.START) < end;
  //           let validate4 = new Date(x?.START) >= end;
  //           let validate5 = new Date(x?.START) >= start;
  //           let validate6 = new Date(x?.END) <= end;
  //           return (
  //             (validate1 && validate2) ||
  //             (validate3 && validate4) ||
  //             (validate5 && validate6)
  //           );
  //         })
  //         ?.map((t) => ({ ID: t?.ID, START: t?.START, END: t?.END }));

  //       if (filter?.length === 0) {
  //         sameTimeScheduleArr?.push([
  //           { ID: item?.ID, START: item?.START, END: item?.END },
  //         ]);
  //       } else {
  //         sameTimeScheduleArr?.push(filter);
  //       }
  //     });

  //     let temp = [];
  //     sameTimeScheduleArr?.forEach((arr) => {
  //       arr.forEach((a) => temp.push(a));
  //     });
  //     // console.log(sameTimeScheduleArr);

  //     // console.log(item?.ID, sameTimeScheduleArr);

  //     let jsonArr = [];
  //     sameTimeScheduleArr?.forEach((item) => {
  //       let json = JSON.stringify(item);
  //       let find = jsonArr?.find((x) => x === json);
  //       if (!find) jsonArr?.push(json);
  //     });

  //     let result = [];
  //     jsonArr?.forEach((item, i) => {
  //       let temp = JSON.parse(item);
  //       temp?.forEach(
  //         (t) =>
  //           !result?.find((x) => x?.ID === t?.ID) &&
  //           result?.push({ ...t, GROUP: i }),
  //       );
  //     });
  //     result?.sort((a, b) => new Date(a?.START) - new Date(b?.START));

  //     let findGroupId = result?.find((x) => x?.ID === item?.ID)?.GROUP;
  //     let sameGroupList = result?.filter((x) => x?.GROUP === findGroupId);
  //     let findOrder = sameGroupList?.findIndex((x) => x?.ID === item?.ID);
  //     // console.log(item?.ID, sameGroupList);
  //     let isGroupIn = sameGroupList?.filter((x) => {
  //       let validate1 = new Date(x?.START) < new Date(item?.END);
  //       let validate2 = new Date(x?.END) >= new Date(item?.END);
  //       let validate3 = new Date(x?.END) > new Date(item?.START);
  //       let validate4 = new Date(x?.START) <= new Date(item?.START);

  //       return (
  //         (validate1 && validate2) ||
  //         (validate3 && validate4) ||
  //         (validate2 && validate4)
  //       );
  //     });
  //     let isGroupOut = sameGroupList?.filter((x) => {
  //       let validate1 = new Date(x?.START) >= new Date(item?.END);
  //       let validate2 = new Date(x?.END) <= new Date(item?.START);
  //       let validate3 = x?.ID !== item?.ID;
  //       // let validate3 = new Date(x?.START) > new Date(item?.START);
  //       // let validate4 = new Date(x?.START) >= new Date(item?.END);
  //       return (validate1 || validate2) && true; //validate3;
  //     });
  //     // console.log(item?.ID, isGroupIn, isGroupOut);

  //     let minus = 0;
  //     // if (
  //     //   isGroupIn?.length > 0 ||
  //     //   isGroupOut?.length > 0 //||
  //     //   // (isGroupIn?.length === 0 && isGroupOut?.length === 0)
  //     // ) {
  //     //   minus = 1;
  //     // }

  //     // let inIdx = sameGroupList?.findIndex((x) => x?.ID === isGroupOut[0]?.ID);
  //     // console.log(sameGroupList);
  //     let tempCalc = sameGroupList?.length - minus;
  //     let widthCalc = tempCalc === 0 ? 90 : 90 / tempCalc;
  //     // console.log(item?.ID, tempCalc);
  //     let leftCalc = widthCalc * findOrder; //(inIdx > -1 ? inIdx : findOrder);
  //     // if (minus > 0 && inIdx > 0) {
  //     //   document.querySelector('.group-king');
  //     // }

  //     let style = {
  //       top: `calc(${startHCalc}px + ${startMCalc}%)`,
  //       height: `calc(${endHCalc}px + ${endMCalc}%)`,
  //       width: `calc(${widthCalc}%)`,
  //       left: `${leftCalc}%`,
  //     };
  //     return style;
  //   },
  //   [timeSettingInitData, startTime, endTime, list, date],
  // );
}

const Container = Styled.div`
  position: absolute;
  padding: 1px;
  overflow: hidden;
  min-height: 25px;
  filter: opacity(0.9);
  transition: .2s;
  z-index: 3;
  width: 100%;
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
