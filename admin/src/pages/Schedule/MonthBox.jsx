import React, { useMemo } from 'react';
import Styled from 'styled-components';
import useStore from '%/useStore';

export default function 스케줄박스({ data }) {
  if (!data) return null;
  const colorList = useStore((x) => x?.colorList);

  const bg = useMemo(() => colorList[data?.ROOM_ID], [colorList, data]);

  const hour = useMemo(() => {
    let time = data?.START?.split(' ')[1];
    return time?.split(':')[0];
  }, [data]);

  return (
    <Container key={data?.ID} bg={bg}>
      <span>
        {hour}시. {data?.TITLE}
      </span>
    </Container>
  );
}

const Container = Styled.div`
  padding: 6px;
  border-radius: 3px;
  background-color: #519a92;
  box-shadow: 1px 2px 4px #55555520;
  margin-bottom: 5px;
  position: relative;
  background-color: ${(x) => x?.bg ?? '#555'};
  transition: .2s;
  &:hover {
    filter: opacity(1);
  }
  &:last-of-type {
    margin-bottom: 0;
  }
  & > span {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }
`;
