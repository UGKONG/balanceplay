import React, { useState } from 'react';
import Styled from 'styled-components';
import SubLi from './SubLi';

export default function 메인검사 ({ idx, item, sub }) {
  if (!item) return null;

  return (
    <Wrap>
      <Title>{idx + 1}. {item?.NAME}</Title>
      <Sub>
        <Month>{item?.MIN_MONTH}개월 ~ {Math.round(item?.MAX_MONTH / 12)}세</Month>
        <Method>{item?.METHOD_TEXT}</Method>
      </Sub>
      <Description>{item?.DESCRIPTION}</Description>
      {sub.length > 0 && <SubList>
        {sub?.map(item => (
          <SubLi key={item?.ID} item={item} />
        ))}
      </SubList>}
    </Wrap>
  )
}

const Wrap = Styled.li`
  margin-bottom: 30px;
`;
const Title = Styled.p`
  font-size: 17px;
  font-weight: 500;
  color: #12af90;
  margin-bottom: 4px;
`;
const Sub = Styled.div`
  width: calc(100% - 5px);
  border: 1px solid #ddd;
  margin: 6px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #444;
`;
const Month = Styled.p`
  text-align: center;
  flex: 1;
  padding: 6px;
  border-right: 1px solid #ddd;
`;
const Method = Styled.p`
  text-align: center;
  flex: 1;
  padding: 6px;
`;
const Description = Styled.p`
  font-size: 15px;
  color: #333;
  padding: 0 3px;
`;
const SubList = Styled.ul`
  margin-top: 10px;
  padding: 0 5px;
`;