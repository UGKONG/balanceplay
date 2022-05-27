import React from 'react';
import Styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export default function 메뉴리스트 ({ item }) {

  return (
    <Wrap>
      <Text to={item?.TO}>{item?.NAME}</Text>
    </Wrap>
  )
}

const Wrap = Styled.li`
  margin-left: 6px;
  height: 100%;
`;
const Text = Styled(NavLink)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 6px;
  white-space: nowrap;
  font-weight: 500;
  color: #999;
  &:hover {
    color: #74c2b9;
  }
  &.active {
    color: #008a87;
    text-shadow: 0px 0px 0px #008a87;
  }
`;