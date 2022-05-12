import React, { useMemo } from 'react';
import Styled from 'styled-components';

export default function 포인트리스트 ({ item }) {

  const percent = useMemo(() => {
    if (!item?.MAX_POINT) return { original: 0, normal: 0 };
    let original = item?.POINT / item?.MAX_POINT * 100;
    let normal = Math.round(original);
    return { original, normal };
  }, [item]);

  return (
    <Wrap>
      <Title>
        <Name>{item?.CATEGORY_NAME ?? '카테고리 이름'}</Name>
        <Percent>{percent.normal}%</Percent>
      </Title>
      <Progress>
        <Bar percent={percent.original} />
      </Progress>
    </Wrap>
  )
}

const Wrap = Styled.li`
  margin-bottom: 10px;
`;
const Title = Styled.h4`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;
const Name = Styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #0e7a79;
`;
const Percent = Styled.small`
  color: #0e7a79;
`;
const Progress = Styled.div`
  display: block;
  width: 100%;
  height: 8px;
  border: 1px solid #00ada988;
  border-radius: 10px;
  overflow: hidden;
`;
const Bar = Styled.p`
  width: ${x => x?.percent ?? 0}%;
  height: 100%;
  background-color: #00ada970;
`;
