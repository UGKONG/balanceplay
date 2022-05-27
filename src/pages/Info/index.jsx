import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import Center from './Center';
import BalancePlay from './BalancePlay';
import Liansoft from './Liansoft';
import App from './App';

export default function 정보페이지 () {
  const tabList = useRef([
    { id: 1, name: '앱 정보' },
    { id: 2, name: '센터 정보' },
    { id: 3, name: '로직개발 및 운영사' },
    { id: 4, name: '웹/앱 개발' },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);

  const findTitle = useMemo(() => {
    let find = tabList.current?.find(x => x?.id === activeTabId);
    if (!find) return '';
    let result = find?.name?.split(' ')[0];
    return find?.name;
  }, [tabList, activeTabId]);

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>{findTitle}</Title>
        {tabList.current?.length > 0 && (
          <TabList>
            {tabList.current?.map(item => (
              <Tab key={item?.id}
                className={activeTabId === item?.id ? 'active' : ''}
                onClick={() => setActiveTabId(item?.id)}
              >{item?.name}</Tab>
            ))}
          </TabList>
        )}
        <TabContents>
          {activeTabId === 1 && <App Style={Style} /> }
          {activeTabId === 2 && <Center Style={Style} /> }
          {activeTabId === 3 && <BalancePlay Style={Style} /> }
          {activeTabId === 4 && <Liansoft Style={Style} /> }
        </TabContents>
      </Header>
    </PageAnimate>
  )
}

const Header = Styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-flow: column;
`;
const Title = Styled.h2``;
const TabList = Styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;
const Tab = Styled.li`
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 3px;
  margin-right: 6px;
  cursor: pointer;
  color: #fff;
  background-color: #96beba;

  word-break: keep-all;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 74px;
  flex: 1;
  &.active {
    background-color: #36aea0;
  }
`;
const TabContents = Styled.div`
  padding: 25px 0;
  width: 100%;
`;
// 모든 정보 페이지 공통 스타일
const Style = {
  Wrap: Styled.section``,
  Row: Styled.div`
    margin-bottom: ${x => x?.margin ?? 30}px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    &:last-of-type { margin-bottom: 0; }
  `,
  SubTitle: Styled.span`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-left: 3px solid #36aea0;
    text-indent: 8px;
    width: 125px;
    min-width: 125px;
    font-weight: 500;
  `,
  Contents: Styled.span`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #666;
    word-break: keep-all;

    a {
      text-decoration: underline;
    }
  `,
}