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
  width: 100%;
  margin-bottom: 5px;
  font-size: 12px;
  color: #777;
  flex-direction: column;
  align-items: flex-start !important;
  padding-left: 10px;
  position: relative;
  &::before {
    content: '·';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-weight: 700;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
`;
const Date = Styled.p`
  font-size: 10px;

`;