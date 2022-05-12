import React, { useState } from 'react';
import Styled from 'styled-components';

export default function 메인검사 ({ item }) {

  return (
    <Wrap>
      <Name>- {item.NAME}</Name>
      <Description>{item.DESCRIPTION}</Description>
    </Wrap>
  )
}

const Wrap = Styled.li`
  margin-bottom: 6px;
`;
const Name = Styled.p`
  font-size: 15px;
  font-weight: 500;
  color: #1bad71;
`;
const Description = Styled.p`
  padding: 0 4px;
  font-size: 14px;
  color: #444;
`;