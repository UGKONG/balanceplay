import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';

export default function 개발자페이지 () {
  const [list, setList] = useState([]);

  const getLog = () => {
    useAxios.get('/log').then(({ data }) => {
      if (!data?.data) return setList([]);
      setList(data?.data);
    })
  }

  useEffect(getLog, []);

  return (
    <Main>
      <Title>REST API LOG</Title>

      <List>
        {list?.map((item, i) => (
          <Li key={i}>
            <SubTitle>{item?.IP} <span>{item?.DATE}</span></SubTitle>
            <Contents><b>{item?.METHOD}</b> {item?.PATH}</Contents>
          </Li>
        ))}
      </List>
    </Main>
  )
}

const Main = Styled.main`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
const Title = Styled.h2``;
const List = Styled.ul``;
const Li = Styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  font-size: 14px;
  min-height: 34px;
  &:last-of-type { margin-bottom: 0; }
`;
const SubTitle = Styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-indent: 8px;
  font-weight: 600;
  letter-spacing: 1px;
  border-left: 3px solid #00ada9;
  span {
    font-weight: 400;
    font-size: 12px;
  }
`;
const Contents = Styled.div`
  word-break: keep-all;
  width: 100%;
  margin-top: 4px;
  text-indent: 10px;
  b {
    font-weight: 500;
  }
`;