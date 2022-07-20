import React, { useMemo } from 'react';
import Box from './Box';

export default function 주칼럼({ data, currentHourList }) {
  if (data?.list?.length === 0) return null;
  const [date, list] = useMemo(() => [data?.date, data?.list], [data]);
  console.log(list);

  const groupList = (item) => {
    const { ID, START_DATE, START_TIME, END_DATE, END_TIME } = {
      ID: item?.ID,
      START_DATE: item?.START?.split(' ')[0],
      START_TIME: item?.START?.split(' ')[1],
      END_DATE: item?.END?.split(' ')[0],
      END_TIME: item?.END?.split(' ')[1],
    };

    let result = {};
    return result;
  };

  return (
    <>
      {list?.map((item, i) => (
        <Box
          key={i}
          data={item}
          widthLeft={groupList(item)}
          currentHourList={currentHourList}
        />
      ))}
    </>
  );
}
