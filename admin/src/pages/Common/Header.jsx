import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import LoginInfo from './LoginInfo';
import MenuLi from './MenuLi';
import logo from '~/images/logo.svg';

export default function 해더 () {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const getList = () => {
    useAxios.get('/menu/2').then(({ data }) => {
      if (!data?.result || !data?.data?.length === 0) {
        setList([]);
        return;
      }
      setList(data?.data);
    })
  }

  const logoClick = () => navigate('/');

  useEffect(getList, []);

  return (
    <Header>
      <Logo img={logo} onClick={logoClick} />
      <Nav>
        <Menu>
          {list?.map(item => (
            <MenuLi key={item?.ID} item={item} />
          ))}
        </Menu>
        <LoginInfo />
      </Nav>
      
    </Header>
  )
}

const Header = Styled.header`
  width: 100%;
  height: 90px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 5px #aaaaaa60;
  padding: 10px 20px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Logo = Styled.h2`
  width: 170px;
  height: 100%;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url(${x => x.img});
`;
const Nav = Styled.nav`
  display: flex;
  height: 100%;
`;
const Menu = Styled.ul`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
`;