import React from 'react';
import Styled from 'styled-components';

export default function 히스토리리스트 ({ data }) {
  return (
    <Wrap>
      {data?.HISTORY}
      <Date>{data?.CREATE_DT}</Date>
    </Wrap>
  )
}

const Wrap = Styled.div`
  padding: 10px 10px 24px;
  border-radius: 5px;
  background-color: #fff;
  font-size: 13px;
  margin-bottom: 10px;
  border: 1px solid #c9ebe7;
  position: relative;
`;
const Date = Styled.p`
  position: absolute;
  bottom: 5px;
  right: 8px;
  font-size: 12px;
  letter-spacing: 1px;
  color: #777;
`;