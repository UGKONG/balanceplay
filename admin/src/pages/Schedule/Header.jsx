import React, { useRef } from 'react';
import Styled from 'styled-components';

export default function 스케줄해더({ active, setActive }) {

  const viewTypeList = useRef([
    { id: 1, name: '년' },
    { id: 2, name: '월' },
    { id: 3, name: '주' },
    { id: 4, name: '일' },
  ]);

  return (
    <Container>
      <Left>
        <span>{active?.start}</span>
        <span>~</span>
        <span>{active?.end}</span>
      </Left>
      <Right>
        {viewTypeList?.current?.map(item => (
          <ViewItem
            key={item?.id}
            className={active?.view === item?.id ? 'active' : ''}
            onClick={() => setActive?.view(item?.id)}>
            {item?.name}
          </ViewItem>
        ))}
      </Right>
    </Container>
  )
}

const Container = Styled.article`
  height: 35px;
  border-bottom: 1px solid #b9e1dc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 0 3px 0 8px;
`
const Left = Styled.div`
  span {
    coor: #949897;
    font-size: 14px;
    display: inline-block;
    margin-right: 5px;
  }
`
const Right = Styled.ul`
  display: flex;
`
const ViewItem = Styled.li`
  width: 28px;
  height: 28px;
  border-left: 1px solid #b9e1dc;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid #c9ebe7;
  color: #949897;
  margin-left: 3px;
  cursor: pointer;

  &:hover {
    background-color: #def0ee;
  }
  &.active {
    color: #fff;
    background-color: #00ada9;
  }
`