import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Info from './Info';
import Family from './Family';
import Test from './Test';
import Now from './Now';
import Other from './Other';
import Result from './Result';

export default function () {
  const navigate = useNavigate();
  const location = useLocation();
  const loginData = location.state;
  const [active, setActive] = useState(1);
  const [totalData, setTotalData] = useState({
    info: null, family: null, test: null, now: null, other: null
  });
  const pages = useRef([
    { id: 1, title: '인적사항', component: Info },
    { id: 2, title: '가족사항', component: Family },
    { id: 3, title: '언어인지 발달 수준', component: Test },
    { id: 4, title: '현재 검사', component: Now },
    { id: 5, title: '특이사항', component: Other },
    { id: 6, title: '최종결과', component: Result },
  ]);

  const next = () => setActive(x => x + 1);
  const loginCheck = () => {
    !loginData?.userAuthId && navigate('/login');
  }

  useEffect(loginCheck, []);

	return (
		<Wrap>
			<Title>초기면접지 작성</Title>
      <Status>
        {pages.current.map(item => (
          <span key={item.id}
            className={active === item.id ? 'active' : ''}
          />
        ))}
      </Status>
      
      <Page>
        {pages.current.map(item => (
          active === item.id && <item.component
            key={item.id}
            id={item.id}
            title={item.title}
            userName={loginData?.userName ?? null}
            userAuthId={loginData?.userAuthId ?? null}
            userEmail={loginData?.userEmail ?? null}
            userPlatform={loginData?.userPlatform ?? null}
            userImg={loginData?.userImg ?? null}
            allCount={pages.current.length}
            next={next}
            setTotalData={setTotalData}
          />
        ))}
      </Page>

		</Wrap>
	)
}

const Wrap = Styled.main`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw !important;
  height: 100vh !important;
  padding: 20px !important;
`;
const Title = Styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #008a87;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row;
  flex-wrap: nowrap;
  padding-bottom: 20px;
`;
const Status = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #94d1ca;
    width: 10px;
    height: 10px;
    border: 2px solid #94d1ca;
    border-radius: 50%;
    position: relative;
    margin-right: 10vw;
    &.active {
      width: 16px;
      height: 16px;
      background-color: #008a87;
    }
    &::after {
      content: '';
      width: 10vw;
      height: 2px;
      display: flex;
      position: absolute;
      top: 50%;
      left: calc(100% + 2px);
      transform: translateY(-50%);
      background-color: #94d1ca;
    }
    &:last-of-type {
      margin-right: 0;
      &::after {
        display: none;
      }
    }
  }
  
`;
const Page = Styled.span`
  
`;