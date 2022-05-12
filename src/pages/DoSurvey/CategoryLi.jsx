import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import { GiToolbox } from "react-icons/gi";

export default function 카테고리 ({ item, categoryClick }) {

  const click = () => {
    categoryClick(item);
  }

  return (
    <Wrap onClick={click}>
      <Header>
        <Title>{item?.CATEGORY_NAME}</Title>
        <Tool><GiToolbox style={{ marginRight: 4 }} />{item?.TOOL}</Tool>
      </Header>
      <Description>{item?.TOOL_DESCRIPTION}</Description>
    </Wrap>
  )

}

const Wrap = Styled.li`
  background-color: #41b6b4;
  color: #fff;
  border-radius: 3px;
  margin-bottom: 10px;
  padding: 8px 10px;
  cursor: pointer;
  &:hover {
    background-color: #2fa9a7;
  }
`;
const Header = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;
const Title = Styled.h4`
  font-size: 14px;
  font-weight: 500;
`;
const Tool = Styled.p`
  font-size: 12px;
`;
const Description = Styled.p`
  font-size: 12px;
  line-height: 16px;
  color: #ffffffcc;
`;