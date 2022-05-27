import React from 'react';
import { NavLink } from 'react-router-dom';
import Styled from 'styled-components';
import useStore from '%/useStore';

export default function 메뉴 ({ item }) {
  const dispatch = useStore(x => x.setState);

  const menuClick = () => {
    dispatch('activeSideMenu', false);
  }

  if (!item?.TO && !item?.NAME) return <Line />;

	return (
    <Wrap onClick={menuClick}>
      <NavLink to={item?.TO} className={x => x.isActive ? 'active' : ''} state={{ METHOD: item?.METHOD }} >
        {item?.NAME}
      </NavLink>
    </Wrap>
	)
}

const Wrap = Styled.li`
  width: 100%;
  margin-bottom: 10px;
  &:last-of-type {
    margin-bottom: 0;
  }

  & > a {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 6px 14px 6px 6px;
    font-weight: 500;
    font-size: 14px;
    color: #999;
    cursor: pointer;

    &:hover {
      color: #74c2b9;
    }
    &.active {
      color: #008a87;
      font-weight: 700;
    }
  }
`;
const Line = Styled.li`
  width: 80%;
  border-bottom: 1px dashed #ddd;
  margin-bottom: 10px;
`;