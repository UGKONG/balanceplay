import React, { useState } from 'react';
import Styled from 'styled-components';
import SubLi from './SubLi';

export default function 메인검사 ({ idx, item, sub }) {
  console.log(idx, item, sub);

  return (
    <Wrap>
      <Title>{idx + 1}. {item.NAME}</Title>
      <Description>{item.DESCRIPTION}</Description>
      {sub.length > 0 && <SubList>
        {sub?.map(item => (
          <SubLi key={item.ID} item={item} />
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
const Description = Styled.p`
  font-size: 15px;
  color: #333;
  padding: 0 3px;
`;
const SubList = Styled.ul`
  margin-top: 10px;
  padding: 0 5px;
`;