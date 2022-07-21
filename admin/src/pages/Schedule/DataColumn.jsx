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
    if (!find) groupId += 1;

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

  // 그룹핑
  const groupingList = useMemo(() => {
    let result = [];
    let groupId = 0;
    duplicateList?.forEach((item) => {
      groupId = grouping(item, result, groupId);
    });
    return result;
  }, [list]);

  // 인덱스 설정
  const resultList = useMemo(() => {
    return groupingList?.map((item) => {
      let groupId = item?.GROUP_ID;
      let groupList = groupingList?.filter((x) => x?.GROUP_ID === groupId);
      let possibleList = notDuplicateFilter(groupList, item);
      let prevIdx = groupList?.findIndex((x) => x?.ID === item?.ID);
      let nextIdx = groupList?.findIndex((x) => x?.ID === possibleList[0]?.ID);
      if (nextIdx === -1 || prevIdx === 0) nextIdx = prevIdx;

      return {
        ...item,
        NEXT_IDX: nextIdx,
        PREV_IDX: prevIdx,
        GROUP_COUNT: groupList?.length,
      };
    });
  }, [groupingList]);

  // 인덱싱 재귀함수
  const indexing = (list) => {
    if (!list[0]) return;
    list[0].PREV_IDX = list[0]?.NEXT_IDX;
    let impossible = notDuplicateFilter(list, list[0]);
    if (impossible[0]) indexing(impossible);
  };

  const indexingList = useMemo(() => {
    let result = [];
    resultList?.forEach((item) => {
      let filter = resultList?.filter((x) => {
        let validate1 = x?.NEXT_IDX === item?.NEXT_IDX;
        let validate2 = x?.GROUP_ID === item?.GROUP_ID;
        return validate1 && validate2;
      });
      let impossible = notDuplicateFilter(filter, item);
      let find = impossible?.find((y) => y?.ID === item?.ID);
      !find && result?.push(item);
      indexing(impossible);
    });
    return result;
  }, [resultList]);

  // 사이징 설정
  const sizingList = useMemo(() => {
    let result = [];
    let groupIdList = [];
    groupingList?.forEach((item) => {
      let find = groupIdList?.find((x) => x === item?.GROUP_ID);
      !find && groupIdList?.push(item?.GROUP_ID);
    });

    groupIdList?.forEach((item) => {
      let list = indexingList?.filter((x) => x?.GROUP_ID === item);
      let idxIdList = [];
      list?.forEach((x) => {
        let idx = idxIdList?.indexOf(x?.PREV_IDX);
        idx === -1 && idxIdList?.push(x?.PREV_IDX);
      });

      let copy = [...list];
      copy?.sort((a, b) => a?.PREV_IDX - b?.PREV_IDX);
      let count = idxIdList?.length;
      idxIdList?.sort((a, b) => a - b);
      idxIdList?.forEach((idx, i) => {
        let filter = copy?.filter((x) => x?.PREV_IDX === idx);
        filter = filter?.map((x) => ({
          ...x,
          PREV_IDX: i,
          GROUP_COUNT: count,
        }));
        filter?.forEach((x) => result?.push(x));
      });
    });

    result?.sort((a, b) => new Date(a?.START) - new Date(b?.START));
    return result;
  }, [indexingList]);

  return (
    <>
      {sizingList?.map((item, i) => (
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
