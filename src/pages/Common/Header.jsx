import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '%/useStore';
import logo from '~/images/logo.svg';
import Styled from 'styled-components';

export default function 해더 () {
  const navigate = useNavigate();
  const dispatch = useStore(x => x.setState);
  const scroll = useStore(x => x.scroll);

  const logoClick = () => navigate('/');
  const menuIconClick = () => dispatch('activeSideMenu', true);

  return (
    <Wrap id='header' style={{ boxShadow: scroll > 20 ? '0 5px 10px #aaaaaa60' : 'unset' }}>
      <h1>
        <button onClick={logoClick} style={{backgroundImage: `url(${logo})`}} />
      </h1>
      <button onClick={menuIconClick}>
        <span /><span /><span />
      </button>
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

  h1 {
    width: 170px;
    height: 100%;

    button {
      background-color: transparent;
      background-repeat: no-repeat;
      background-size: contain;
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
`