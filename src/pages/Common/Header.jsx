import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '%/useStore';
import logo from '~/images/logo.svg';
import Styled from 'styled-components';
import { BiArrowToTop } from "react-icons/bi";

export default function 해더 () {
  const navigate = useNavigate();
  const dispatch = useStore(x => x.setState);
  const activePageRef = useStore(x => x.activePageRef);
  const scroll = useStore(x => x.scroll);

  const logoClick = () => navigate('/');
  const menuIconClick = () => dispatch('activeSideMenu', true);

  const upBtnClick = () => {
    activePageRef.scrollTop = 0;
  }

  const scrollOver1 = useMemo(() => scroll > 10, [scroll]);
  const scrollOver2 = useMemo(() => scroll > 50, [scroll]);
  const scrollOver3 = useMemo(() => scroll > 100, [scroll]);

  return (
    <Wrap id='header' scroll1={scrollOver1} scroll2={scrollOver2}>
      <h1>
        <button onClick={logoClick} style={{backgroundImage: `url(${logo})`}} />
      </h1>
      <button onClick={menuIconClick}>
        <span /><span /><span />
      </button>

      <UpBtn className='upBtn' scroll={scrollOver3} onClick={upBtnClick}>
        <BiArrowToTop size={35} />
      </UpBtn>
    </Wrap>
  )
}

const Wrap = Styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.3s;
  padding: 10px;
  position: relative;
  user-select: none;
  box-shadow: ${x => x.scroll1 ? '0 5px 10px #aaaaaa60' : 'unset'};

  h1 {
    width: 170px;
    height: 100%;

    button {
      background-color: transparent;
      background-repeat: no-repeat;
      background-size: auto 55%;
      background-position: center;
      width: 100%;
      height: 100%;
      display: block;
      &:focus {
        box-shadow: unset !important;
      }
      &:active {
        background-color: unset !important;
      }
    }
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: column;
    width: 40px;
    height: 62%;
    transition: 0.3s;
    background-color: transparent;
    padding: 5px 5px !important;
    border: none;
    &:hover {
      background-color: transparent !important;
    }
    &:focus {
      box-shadow: unset !important;
    }
    &:active {
      background-color: unset !important;
    }

    span {
      width: 100%;
      height: 4px;
      background-color: #00ada9;
      border-radius: 10px;
    }
  }
`;
const UpBtn = Styled.div`
  z-index: 99999999999999999999999999 !important;
  width: 60px;
  height: 60px;
  min-width: 60px;
  max-width: 60px;
  min-height: 60px;
  max-height: 60px;
  border-radius: 50%;
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 2px 5px #aaaaaa50;
  display: ${x => x.scroll ? 'flex' : 'none'} !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #09afac !important;
  &:hover {
    background-color: #08a3a0 !important;
  }
  &:active {
    background-color: #05908d !important;
  }
`;