import React, { useRef } from 'react';
import Styled from 'styled-components';
import useAlert from '%/useAlert';

export default function 메뉴 ({ activeMenu, setActiveMenu }) {
  const menuList = useRef([
    { id: 1, name: '검사', test: false },
    { id: 2, name: '보유 이용권', test: false },
    { id: 3, name: '스케줄', test: false },
    { id: 4, name: '메 모', test: false },
    { id: 5, name: '히스토리', test: false },
    // { id: 6, name: '건강 데이터', test: true },
  ]);

  const onClick = (id, isTest) => {
    if (!id || isTest) return useAlert.info('알림', '점검중입니다.');
    setActiveMenu(id);
  }

  return (
    <Wrap>
      {menuList?.current?.map(item => (
        <MenuLi key={item?.id} 
          className={activeMenu === item?.id ? 'active' : ''}
          onClick={() => onClick(item?.id, item?.test)}
        >
          {item?.name} {item?.test && '(점검중)'}
        </MenuLi>
      ))}
    </Wrap>
  )
}

const Wrap = Styled.ul`
  width: 100%;
`;
const MenuLi = Styled.li`
  padding: 6px 0;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  letter-spacing: 1px;
  margin-bottom: 10px;
  background-color: #c9ebe7;
  border-radius: 4px;
  &:last-of-type {
    margin-bottom: 0;
  }
  &:hover {
    background-color: #b7e0db;
  }
  &.active {
    background-color: #00ada9;
    color: #fff;
  }
`;