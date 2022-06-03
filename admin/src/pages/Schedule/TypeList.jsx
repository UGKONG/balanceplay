import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';

export default function 타입리스트 ({ activeType, setActiveType, activeDetailType, setActiveDetailType, typeList, calendarList }) {
  const [list, setList] = useState([]);

  const getList = () => {
    if (!activeType) return;
    let path = activeType === 1 ? '/calendar' : activeType === 2 ? '/room' : '/teacher';
    useAxios.get(path).then(({ data }) => {
      if (!data?.result || !data?.data) return setList([]);
      setList(data?.data);
    })
  }

  useEffect(getList, [activeType]);

  return (
    <Wrap>
      <TypeList>
        {typeList.length > 0 && (
          typeList.map(item => (
            <TypeLi key={item?.ID} className={activeType === item?.ID ? 'active' : ''} onClick={() => setActiveType(item?.ID)}>
              {item?.NAME}
            </TypeLi>
          ))
        )}
      </TypeList>
      <List>
        {list?.length > 0 && (
          list?.map(item => (
            <Li key={item?.ID} className={activeDetailType === item?.ID ? 'active' : ''} onClick={() => setActiveDetailType(item?.ID)}>
              {item?.NAME}
            </Li>
          ))
        )}
      </List>
    </Wrap>
  )
}

const Wrap = Styled.article`
  width: 200px;
  height: 100%;
  border: 2px solid #b9e1dc;
  border-radius: 10px;
  margin-right: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const TypeList = Styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #b9e1dc;
`;
const TypeLi = Styled.li`
  flex: 1;
  font-size: 13px;
  padding: 8px 0;
  text-align: center;
  border-right: 1px solid #b9e1dc;
  cursor: pointer;
  &:last-of-type {
    border-right: none;
  }
  &.active {
    color: #fff;
    background-color: #00ada9;
  }
`;
const List = Styled.ul`
  flex: 1;
  overflow: auto;
  padding: 0 6px 6px;
  margin-top: 6px;
`;
const Li = Styled.li`
  margin-bottom: 8px;
  text-align: center;
  padding: 6px 0;
  font-size: 13px;
  border: 1px solid #c9ebe7;
  letter-spacing: 1px;
  cursor: pointer;
  &.active {
    color: #fff;
    background-color: #00ada9;
  }
`;