import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Styled from 'styled-components';
import conf from '../../server/config.json';
import useTitle from '%/useTitle';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useStore from '%/useStore';
import Confirm from '%/Confirm';

// Components
import Header from '@/pages/Common/Header';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Member from '@/pages/Member';
import MemberDetail from '@/pages/MemberDetail';
import TestCreate from '@/pages/TestCreate';
import TestDetail from '@/pages/TestDetail';
import Notice from '@/pages/Notice';
import NoticeDetail from '@/pages/NoticeDetail';
import NoticeCreate from '@/pages/NoticeCreate';
import NoticeModify from '@/pages/NoticeModify';
import Schedule from '@/pages/Schedule';
import Voucher from '@/pages/Voucher';
import Account from '@/pages/Account';
import AccountCreate from '@/pages/AccountCreate';
import AccountModify from '@/pages/AccountModify';
import History from '@/pages/History';
import Teacher from '@/pages/Teacher';
import TeacherDetail from '@/pages/TeacherDetail';
import Setting from '@/pages/Setting';
import Payment from '@/pages/Payment';

export default function 앱() {
  const dispatch = useStore((x) => x?.setState);
  const isLogin = useStore((x) => x?.isLogin);
  const isFullPage = useStore((x) => x?.isFullPage);
  const confirmInfo = useStore((x) => x?.confirmInfo);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSession, setIsSession] = useState(false);
  useTitle(conf.programName);

  // 세션 필요없음
  const notSession = useMemo(() => ['login', 'join'], []);

  // 세션 체크
  const sessionChk = useCallback(() => {
    let path = location.pathname;
    for (let i = 0; i < notSession.length; i++) {
      let isTrue = path.indexOf(notSession[i]) > -1;
      if (isTrue) return;
    }

    useAxios.get('/isSession?IS_ADMIN=true').then(({ data }) => {
      if (!data.result) {
        setIsSession(false);
        isLogin && dispatch('isLogin', null);
        navigate('/login/');
        return;
      }
      setIsSession(true);
      !isLogin && dispatch('isLogin', data?.data);
    });
  }, [location, notSession, isLogin, dispatch, isSession, setIsSession]);

  const getSetting = useCallback(() => {
    useAxios.get('/setting').then(({ data }) => {
      if (!data?.result || !data?.data) return dispatch('setting', null);
      dispatch('setting', data?.data);
    });
  }, []);

  // 프로그램 정보
  const programInfo = useMemo(() => {
    let platform = window.navigator.userAgentData?.platform;
    let isMobile = window.navigator.userAgentData?.mobile;
    let browser = window.navigator.userAgentData?.brands;
    browser = browser?.length > 0 ? browser[browser?.length - 1]?.brand : null;
    let result = `
      <span>· ${isMobile ? 'Mobile' : 'PC'}</span>
      <span>· ${platform ?? ''}</span>
      <span>· ${browser ?? ''}</span>
    `;
    return result;
  }, []);

  // 로그아웃
  const logout = () => {
    useAxios.get('/logout').then(() => {
      dispatch('isLogin', null);
      useAlert.success('알림', '로그아웃되었습니다.');
      navigate('/login');
    });
  };

  useEffect(sessionChk, [location]);
  useEffect(getSetting, [location]);

  return (
    <>
      <Name>{conf.programName}</Name>
      {isLogin && isSession && <Header />}
      <Container1 style={isFullPage ? fullPageStyle : null}>
        <Container2>
          <Routes>
            <Route path="/login" element={<Login />} />
            {isLogin && isSession && <Route path="/" element={<Home />} />}
            {isLogin && isSession && (
              <Route path="/member" element={<Member />} />
            )}
            {isLogin && isSession && (
              <Route path="/member/:id" element={<MemberDetail />} />
            )}
            {isLogin && isSession && (
              <Route path="/test/:id/new" element={<TestCreate />} />
            )}
            {isLogin && isSession && (
              <Route path="/test/:id" element={<TestDetail />} />
            )}
            {isLogin && isSession && (
              <Route path="/notice" element={<Notice />} />
            )}
            {isLogin && isSession && (
              <Route path="/notice/new" element={<NoticeCreate />} />
            )}
            {isLogin && isSession && (
              <Route path="/notice/:id" element={<NoticeDetail />} />
            )}
            {isLogin && isSession && (
              <Route path="/noticeModify/:id" element={<NoticeModify />} />
            )}
            {isLogin && isSession && (
              <Route path="/schedule" element={<Schedule />} />
            )}
            {isLogin && isSession && (
              <Route path="/voucher" element={<Voucher />} />
            )}
            {isLogin && isSession && (
              <Route path="/account" element={<Account />} />
            )}
            {isLogin && isSession && (
              <Route path="/account/new" element={<AccountCreate />} />
            )}
            {isLogin && isSession && (
              <Route path="/accountModify/:id" element={<AccountModify />} />
            )}
            {isLogin && isSession && (
              <Route path="/history" element={<History />} />
            )}
            {isLogin && isSession && (
              <Route path="/teacher" element={<Teacher />} />
            )}
            {isLogin && isSession && (
              <Route path="/teacher/:id" element={<TeacherDetail />} />
            )}
            {isLogin && isSession && (
              <Route path="/setting" element={<Setting />} />
            )}
            {isLogin && isSession && (
              <Route path="/payment" element={<Payment />} />
            )}
          </Routes>
        </Container2>
        <Footer>
          <ProgramInfo dangerouslySetInnerHTML={{ __html: programInfo }} />
          {isLogin && isSession && (
            <LogoutBtn title="로그아웃" onClick={logout}>
              로그아웃
            </LogoutBtn>
          )}
        </Footer>
      </Container1>
      <Confirm data={confirmInfo} />
    </>
  );
}
const fullPageStyle = {
  width: '100%',
  height: '100%',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1,
};
const Name = Styled.h1`
  display: none;
`;
const Container1 = Styled.div`
  background-color: #b9e1dc;
  width: 100%;
  height: calc(100% - 90px);
  padding: 20px 20px 30px;
`;
const Container2 = Styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #f1f9f8;
  border-radius: 15px;
`;
const Footer = Styled.div`
  font-size: 12px;
  color: #777;
  position: fixed;
  width: calc(100% - 40px);
  height: 30px;
  line-height: 30px;
  bottom: 0;
  left: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    margin-right: 10px;
  }
`;
const ProgramInfo = Styled.p`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const LogoutBtn = Styled.p`
  cursor: pointer;

  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;
