import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from './Box';

export default function 주칼럼({ data, currentHourList }) {
  if (data?.list?.length === 0) return null;
  const list = useMemo(() => data?.list ?? [], [data]);

  // 중복안됨 필터 함수
  const notDuplicateFilter = useCallback((arr, x) => {
    return arr?.filter((f) => {
      let validate1 = new Date(f?.END) <= new Date(x?.START);
      let validate2 = new Date(f?.START) >= new Date(x?.END);
      return validate1 || validate2;
    });
  }, []);

  // 중복검사 필터 함수
  const duplicateFilter = useCallback((arr, x) => {
    let list = arr?.filter((y) => {
      let validate1 = new Date(x?.END) > new Date(y?.START);
      let validate2 = new Date(x?.START) < new Date(y?.START);
      let validate3 = new Date(x?.START) < new Date(y?.END);
      let validate4 = new Date(x?.END) > new Date(y?.END);
      let validate5 = new Date(x?.START) >= new Date(y?.START);
      let validate6 = new Date(x?.END) <= new Date(y?.END);
      let validate7 = new Date(x?.START) <= new Date(y?.START);
      let validate8 =
        new Date(x?.END)?.getTime() === new Date(y?.END)?.getTime();
      let validate9 =
        new Date(x?.START)?.getTime() === new Date(y?.START)?.getTime();
      let validate10 = new Date(x?.END) >= new Date(y?.END);
      return (
        (validate1 && validate2) ||
        (validate3 && validate4) ||
        (validate5 && validate6) ||
        (validate7 && validate8) ||
        (validate9 && validate10)
      );
    });
    let result = {
      ITEM: x,
      LIST: list,
    };
    return result;
  }, []);

  // 각 스케줄 별 중복 요소 찾기 (중복 제거 X)
  const duplicateList = useMemo(() => {
    return list?.map((x, i) => duplicateFilter(list, x));
  }, [list]);

  // 그룹핑 재귀함수
  const grouping = (item, result, groupId) => {
    let find = result?.find((x) => x?.ID === item?.ITEM?.ID);
    if (!find) {
      groupId += 1;
    }

    item?.LIST?.forEach((x) => {
      let find = result?.find((y) => y?.ID === x?.ID);
      !find && result?.push({ ...x, GROUP_ID: groupId });

      find = result?.find((z) => z?.ID === x?.ID);
      if (!find) {
        let findItem = duplicateList?.find((y) => y?.ID === x?.ID);
        grouping(findItem, result, groupId);
      }
    });

    return groupId;
  };

  const resultList = useMemo(() => {
    let result = [];
    let groupId = 0;
    duplicateList?.forEach((item) => {
      groupId = grouping(item, result, groupId);
    });

    let isMove = false;
    let moveCount = 0;
    let moveInfo = null;
    let maxMoveCount = 0;

    let sendData = result?.map((x) => {
      let thisGroup = result?.filter((y) => y?.GROUP_ID === x?.GROUP_ID);
      let thisIdx = thisGroup?.findIndex((y) => y?.ID === x?.ID);
      let moveIdx = thisIdx;
      let notDuplicateList = notDuplicateFilter(thisGroup, x);
      let firstNotDuplicate = notDuplicateList[0]?.ID;

      let validate1 = notDuplicateList?.length > 0;
      let validate2 = thisIdx !== 0;
      let validate3 = !isMove;
      if (validate1 && validate2 && validate3) {
        moveIdx = thisGroup?.findIndex((y) => y?.ID === firstNotDuplicate);
        if (thisIdx !== moveIdx) {
          isMove = true;
          moveInfo = {
            ID: x?.ID,
            GROUP_ID: x?.GROUP_ID,
            PREV: thisIdx,
            NEXT: moveIdx,
          };
        }
      }
      let resultIsMove = isMove;
      isMove = false;

      moveCount += resultIsMove ? 1 : 0;
      if (moveInfo?.GROUP_ID !== x?.GROUP_ID) {
        maxMoveCount = moveCount;
        moveCount = 0;
      }
      // console.log({
      //   ID: x?.ID,
      //   thisIdx: thisIdx,
      //   moveIdx: moveIdx,
      //   isMove: resultIsMove,
      // });

      return {
        ...x,
        GROUP_IDX: isMove ? thisIdx : moveIdx,
        GROUP_COUNT: thisGroup?.length,
        MOVE_COUNT: moveCount,
      };
    });

    return sendData?.map((x) => ({ ...x }));
  }, [list]);

  return (
    <>
      {resultList?.map((item, i) => (
        <Box
          key={i}
          duplicateIdx={i}
          data={item}
          currentHourList={currentHourList}
        />
      ))}
    </>
  );
}
