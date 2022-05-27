import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import TestLi from './TestLi';

import testIcon1 from '~/images/testIcons/1.svg';
// import testIcon2 from '~/images/testIcons/2.svg';
import testIcon3 from '~/images/testIcons/3.svg';
import testIcon4 from '~/images/testIcons/4.svg';
import testIcon5 from '~/images/testIcons/5.svg';
import testIcon6 from '~/images/testIcons/6.svg';
import testIcon7 from '~/images/testIcons/7.svg';
import testIcon8 from '~/images/testIcons/8.svg';
import testIcon9 from '~/images/testIcons/9.svg';
import testIcon10 from '~/images/testIcons/10.svg';

export default function 종합결과 () {
  const navigate = useNavigate();
  const params = useParams();
  const date = params?.id;
  if (!date) return null;

  const icons = useMemo(() => ({
    testIcon1,
    testIcon3,
    testIcon4,
    testIcon5,
    testIcon6,
    testIcon7,
    testIcon8,
    testIcon9,
    testIcon10
  }), []);
  const [list, setList] = useState([]);

  const getList = () => {
    useAxios.get('/totalResult/' + date).then(({ data }) => {
      if (!data?.result) return setList([]);
      if (!data?.data) return setList([]);
      let temp = [];
      data?.data && data.data.forEach(li => {
        li.ICON = icons['testIcon' + li.ID];
        temp.push(li);
      });
      setList(temp);
    });
  }
  const backPage = () => navigate('/');

  useEffect(getList, []);

	return (
		<PageAnimate name='slide-up'>
      <Header>
        <Title>
          종합 검사결과
          <small>(기준일: {date})</small>
        </Title>
        <BackBtn onClick={backPage}>뒤로가기</BackBtn>
      </Header>
			<List>
        {list?.length === 0 && <NotLi>검사 결과가 없습니다.</NotLi>}
        {list?.length > 0 && list.map((item, i) => (
          <TestLi key={i} item={item} />
        ))}
      </List>
		</PageAnimate>
	)
}

const List = Styled.ul`
  padding-top: 10px;
`;
const NotLi = Styled.li`
  font-size: 14px;
  color: #999;
  margin-top: 40px;
  text-align: center;
`;
const Header = Styled.h2``;
const Title = Styled.span`
  small {
    margin-left: 6px;
    font-size: 13px;
    font-weight: 500;
  }
`;
const BackBtn = Styled.button``;