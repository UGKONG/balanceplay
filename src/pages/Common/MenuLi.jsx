import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import useStore from '%/useStore';
import { useNavigate } from 'react-router-dom';

export default function 메뉴 ({ item, path }) {
  const navigate = useNavigate();
  const dispatch = useStore(x => x.setState);

  const menuClick = () => {
    dispatch('activeSideMenu', false);
    navigate(item.to, { state: item });
  }

	return (
		<Wrap onClick={menuClick}>
			<a className={item?.to === path ? 'active' : ''}>{item.name}</a>
		</Wrap>
	)
}

const Wrap = Styled.li`
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
    color: $gray;
    cursor: pointer;

    &:hover {
      color: #74c2b9;
    }
    &.active {
      color: #008a87;
      font-weight: 700;
    }
  }
`