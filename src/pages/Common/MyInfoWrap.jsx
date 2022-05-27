import React from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import { FaUserAlt } from "react-icons/fa";
import useStore from '%/useStore';

export default function 사이드메뉴_내정보 ({ data }) {
  const navigate = useNavigate();
  const dispatch = useStore(x => x.setState);

  const myInfoNavigate = () => {
    navigate('/myInfo/');
    dispatch('activeSideMenu', false);
  }

  return (
    <Wrap title='내정보 페이지로 이동' onClick={myInfoNavigate}>
      <ProfileImg style={{ backgroundImage: 'url(' + data?.IMG + ')' }}>
        {!data?.IMG && <FaUserAlt />}
      </ProfileImg>
      <ProfileInfo>
        <p className='no'>SN. { data?.ID }</p>
        <p className='name'>성 명 : { data?.NAME }</p>
      </ProfileInfo>
    </Wrap>
  )
}

const Wrap = Styled.div`
  height: 100px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
  padding-bottom: 15px;
  padding: 0 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const ProfileImg = Styled.div`
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
`;
const ProfileInfo = Styled.div`
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
`;