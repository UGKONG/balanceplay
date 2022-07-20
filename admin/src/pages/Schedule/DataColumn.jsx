import React, { useCallback, useMemo } from 'react';
import Box from './Box';

export default function 주칼럼({ data, currentHourList }) {
  if (data?.list?.length === 0) return null;
  const list = useMemo(() => data?.list, [data]);

  const duplicateFilter = (arr, x) => {
    return arr?.filter((y) => {
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
  };

  const test = useMemo(() => {
    let result = [];

    let temp = [];
    list?.forEach((x) => {
      let filter = duplicateFilter(list, x);
      temp.push({ ID: x?.ID, DUPL: filter });
    });

    // console.log(temp);

    temp?.forEach((x) => {
      let id = x?.ID;
      temp?.forEach((y) => {
        let dupl = y?.DUPL;
        let find = dupl?.find((z) => z?.ID === id);
        find && result?.push([...dupl, ...x?.DUPL]);
      });
    });

    let result2 = [];
    result?.forEach((x) => {
      let temp = [];
      x?.forEach((y) => {
        !temp?.find((z) => z?.ID === y?.ID) && temp?.push(y);
      });
      result2?.push(temp);
    });

    let result3 = [];
    result2?.forEach((x) => {
      let json = JSON.stringify(x);
      !result3?.find((y) => y === json) && result3?.push(json);
    });
    result3 = result3?.map((x) => JSON?.parse(x));
    result3?.sort((a, b) => b?.length - a?.length);

    let result4 = [];
    let many = result3[0];
    return console.log(many);
    many?.forEach((x, i) => {
      if (i === 0) {
        result4?.push(x);
      } else {
        let findIdx = x?.findIndex((y) => y?.ID === x?.ID);
        findIdx > -1 && result4?.push(many[findIdx]);
      }
    });
    console.log('result3', result3);
  }, [list]);

  const groupFindList = useMemo(() => {
    // 중복 요소 찾기1 (중복 제거 X)
    let temp1 = [];
    // console.log(list);
    list?.forEach((x, i) => {
      let filter = duplicateFilter(list, x);
      filter?.length > 1 && temp1?.push(filter);
    });
    if (temp1?.length === 0) return [...list];
    // console.log(temp1);

    // 멀티 중복 요소 찾기
    let temp2 = [];
    temp1?.forEach((x) => {
      let json1 = JSON.stringify(x?.map((z) => z?.ID));
      temp1?.forEach((y) => {
        let json2 = JSON.stringify(y?.map((z) => z?.ID));
        json1 === json2 && temp2?.push(json1);
      });
    });

    let temp3 = [];
    temp2?.forEach((x) => {
      let find = temp3?.find((y) => y === x);
      !find && temp3?.push(x);
    });

    let temp4 = [];
    temp3?.forEach((x) => {
      let filter = temp2?.filter((y) => y === x)?.length;
      filter > 1 && temp4?.push(x);
    });
    temp4 = temp4?.map((x) => JSON.parse(x));

    let temp5 = [];
    temp4?.forEach((x, i) => {
      x?.forEach((y) => {
        let find = list?.find((z) => z?.ID === y);
        temp5?.push({ ID: find?.ID, GROUP_ID: i + 1 });
      });
    });

    return list?.map((x) => {
      let find = temp5?.find((y) => y?.ID === x?.ID);
      let count = temp5?.filter((y) => y?.GROUP_ID === find?.GROUP_ID)?.length;
      let thisGroup = temp5?.filter((y) => y?.GROUP_ID === find?.GROUP_ID);
      let groupIdx =
        thisGroup?.length === 0
          ? 0
          : thisGroup?.findIndex((y) => y?.ID === find?.ID);

      return {
        ...x,
        GROUP_ID: find?.GROUP_ID ?? null,
        GROUP_COUNT: count ?? 1,
        GROUP_IDX: groupIdx ?? 0,
      };
    });
  }, [list]);

  // groupFindList;
  test;

  return (
    <>
      {groupFindList?.map((item, i) => (
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
