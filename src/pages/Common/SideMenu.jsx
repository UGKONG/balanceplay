import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import useStore from '%/useStore';
import useAxios from '%/useAxios';
import MyInfoWrap from './MyInfoWrap';
import MenuLi from './MenuLi';

export default function 사이드메뉴 () {
  const navigate = useNavigate();
  const dispatch = useStore(x => x.setState);
  const isLogin = useStore(x => x.isLogin);
  const activeSideMenu = useStore(x => x.activeSideMenu);
  const [list, setList] = useState([]);

  const getList = () => {
    useAxios.get('/menu/1').then(({ data }) => {
      if (!data?.result || !data?.data) return setList([]);
      setList(data?.data);
    });
  }
  const closeSideMenu = () => {
    dispatch('activeSideMenu', false);
  }
  const logout = () => {
    useAxios.get('/logout').then(({ data }) => {
      dispatch('isLogin', null);
      closeSideMenu();
      navigate('/login');
    });
  }
  
  useEffect(getList, []);

	return (
		<>
			{activeSideMenu && (
        <PageAnimate name='fade'>
          <div className='bg' onClick={closeSideMenu} />
        </PageAnimate>
      )}

      <Wrap className={ activeSideMenu ? 'active' : '' }>
        <MyInfoWrap data={isLogin} />

        <MenuList>
          {list?.map(item => (
            <MenuLi key={item.ID} item={item} />
          ))}
          <LogoutBtn onClick={logout}><BiLogOut />로그아웃</LogoutBtn>
        </MenuList>
      </Wrap>
		</>
	)
}

const Wrap = Styled.aside`
  position: fixed;
  top: 0;
  right: -250px;
  width: 250px;
  height: 100%;
  transition: right 0.3s;
  background-color: #fff;
  padding: 10px;
  z-index: 5;

  &.active {
    right: 0;
  }
`;
const MenuList = Styled.ul`
  height: calc(100% - 115px);
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  flex-flow: column;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 2px;
  }
`;
const LogoutBtn = Styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 400;
  color: #777;
  transition: 0.1s;
  text-align: right;
  cursor: pointer;
  float: right;
  padding: 6px 14px 6px 6px;

  i,
  svg {
    font-weight: 900;
    margin-right: 5px;
  }

  &:hover {
    color: #282828;
  }
}
`;