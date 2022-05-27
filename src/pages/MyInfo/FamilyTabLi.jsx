import React, { useMemo } from 'react';
import Styled from 'styled-components';
import { AiOutlinePlus, AiFillPlusSquare } from "react-icons/ai";

export default function 가족탭 ({ active, setActive, item }) {

  if (!item) return null;

  const isActive = useMemo(() => active === item?.ID, [active, item]);

  const tabClick = () => {
    setActive(item?.ID);
  }

  return (
    <Wrap isActive={isActive} onClick={tabClick}>{item?.TYPE}</Wrap>
  )
}

const Wrap = Styled.li`
  padding: 5px 10px;
  white-space: nowrap;
  color: #fff;
  font-size: 14px;
  border-radius: 3px;
  margin-right: 6px;
  cursor: pointer;
  background-color: ${x => x.isActive ? '#36aea0' : '#96beba'};
`;