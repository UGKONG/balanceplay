import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserAlt } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import useStore from '%/useStore';
import useAxios from '%/useAxios';
import MenuLi from './MenuLi';

export default function () {
  const navigate = useNavigate();
  const location = useLocation();
  const locationPath = location.pathname;
  const dispatch = useStore(x => x.setState);
  const isLogin = useStore(x => x.isLogin);
  const activeSideMenu = useStore(x => x.activeSideMenu);
  const list = useRef([
    { to: "/", name: "HOME", exact: true },
    { to: "/testInformation/", name: "검사 개요", disabled: false, exact: true },
    { to: "/survey/1/", name: "영유아 운동 선별 검사", disabled: true, exact: false },
    { to: "/survey/3/", name: "유아 식습관 검사", disabled: false, exact: false },
    { to: "/survey/4/", name: "기질 검사", disabled: false, exact: false },
    { to: "/survey/5/", name: "감각 기능 검사", disabled: false, exact: false },
    { to: "/survey/6/", name: "감각 운동 검사", disabled: false, exact: false },
    { to: "/survey/7/", name: "대근육 운동 이동 검사", disabled: true, exact: false },
    { to: "/survey/8/", name: "대근육 운동 조작 검사", disabled: true, exact: false },
    { to: "/survey/9/", name: "유아 정서 지능 검사", disabled: false, exact: false },
    { to: "/survey/10/", name: "양육 태도 검사", disabled: false, exact: false },
    { to: "/notice/", name: "공지사항", exact: false },
    { to: "/mySchedule/", name: "나의 스케줄", exact: false },
    { to: "/myInfo/", name: "내정보", exact: false },
    { to: "/Info/", name: "정보", exact: false },
  ]);
  const closeSideMenu = () => {
    dispatch('activeSideMenu', false);
  }
  const logout = () => {
    useAxios.get('/logout').then(({ data }) => {
      dispatch('isLogin', null);
      closeSideMenu();
      navigate('/login');
      console.log(data);
    });
  }
  
	return (
		<>
			{activeSideMenu && <PageAnimate name='fade'>
        <div className='bg' onClick={closeSideMenu} />
      </PageAnimate>}

      <Wrap className={ activeSideMenu ? 'active' : '' }>
        <div className='my-info'>
          <div className='profile-img' style={{ backgroundImage: 'url(' + isLogin?.IMG + ')' }}>
            {!isLogin?.IMG && <FaUserAlt />}
          </div>
          <div className='profile-info'>
            <p className='no'>SN. { isLogin?.ID }</p>
            <p className='name'>성 명 : { isLogin?.NAME }</p>
          </div>
        </div>
        <ul className='menu-list'>
          {list.current.map(item => <MenuLi key={item.to} item={item} path={locationPath} />)}
          <li className='logout' onClick={logout}>
            <BiLogOut />로그아웃
          </li>
        </ul>
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

  .my-info {
    height: 100px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 15px;
    padding-bottom: 15px;
    padding: 0 10px 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .profile-img {
      border: 1px solid #008a87;
      border-radius: 200px;
      background-color: transparent;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-flow: column;
      width: 64px;
      height: 64px;
      margin-right: 20px;
      overflow: hidden;
      i,
      svg {
        font-size: 50px;
        color: #777;
      }
    }
    .profile-info {
      width: calc(100% - 90px);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-flow: column;

      p {
        width: 100%;
        padding: 5px 0;
        color: #008a87;
        &:last-of-type {
          font-size: 17px;
        }
      }
    }
  }
  .menu-list {
    height: calc(100% - 115px);
    overflow: auto;

    &::-webkit-scrollbar {
      width: 2px;
    }
  }
  .logout {
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