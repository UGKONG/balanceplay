import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Styled from 'styled-components';
import conf from '../server/config.json';
import useTitle from '%/useTitle';
import useAxios from '%/useAxios';
import useStore from '%/useStore';

// Components
import Header from '@/pages/Common/Header';
import SideMenu from '@/pages/Common/SideMenu';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Join from '@/pages/Join';
import Terms from './pages/Join/Terms';
import Duplicate from '@/pages/Duplicate';
import TotalResult from '@/pages/TotalResult';
import Survey from '@/pages/Survey';
import DoSurvey from '@/pages/DoSurvey';
import Notice from '@/pages/Notice';
import NoticeDetail from '@/pages/NoticeDetail';
import TestInformation from '@/pages/TestInformation';
import MySchedule from '@/pages/MySchedule';
import MyInfo from '@/pages/MyInfo';
import Info from '@/pages/Info';
import SurveyReadOnly from '@/pages/SurveyReadOnly';
import JoinDataView from '@/pages/JoinDataView';
import Term from '@/pages/Info/Term';
import Dev from '@/pages/Dev';

export default function 앱 () {
  const dispatch = useStore(x => x.setState);
  const isLogin = useStore(x => x.isLogin);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSession, setIsSession] = useState(false);
  useTitle(conf.programName);

  const notSession = [
    'login', 'join', 'duplicate', 'terms',
  ];
  
  const sessionChk = () => {
    let path = location.pathname;
    for (let i = 0; i < notSession.length; i++) {
      let isTrue = path.indexOf(notSession[i]) > -1;
      if (isTrue) return;
    }

    useAxios.get('/isSession?IS_ADMIN=false').then(({ data }) => {
      if (!data.result) {
        setIsSession(false);
        isLogin && dispatch('isLogin', null);
        navigate('/login/');
        return;
      }
      setIsSession(true);
      !isLogin && dispatch('isLogin', data?.data);
    });
  }
  
  useEffect(sessionChk, [location]);

  const RoutesMemo = useCallback(() => (
    <div id='wrap'>
      <Name>{conf.programName}</Name>
      {isLogin && isSession && <Header programName={conf.programName} />}
      <Routes>
        <Route path='/terms' element={<Terms />} />
        <Route path='/login' element={<Login />} />
        <Route path='/join' element={<Join />} />
        <Route path='/duplicate' element={<Duplicate />} />
        <Route path='/dev' element={<Dev />} />
        {isLogin && isSession && <Route path='/' element={<Home />} />}
        {isLogin && isSession && <Route path='/testInformation' element={<TestInformation />} />}
        {isLogin && isSession && <Route path='/totalresult/:id' element={<TotalResult />} />}
        {isLogin && isSession && <Route path='/survey/:id' element={<Survey />} />}
        {isLogin && isSession && <Route path='/survey/:id/new' element={<DoSurvey />} />}
        {isLogin && isSession && <Route path='/survey/:id/readOnly' element={<SurveyReadOnly />} />}
        {isLogin && isSession && <Route path='/notice' element={<Notice />} />}
        {isLogin && isSession && <Route path='/notice/:id' element={<NoticeDetail />} />}
        {isLogin && isSession && <Route path='/mySchedule' element={<MySchedule />} />}
        {isLogin && isSession && <Route path='/myInfo' element={<MyInfo />} />}
        {isLogin && isSession && <Route path='/myJoinData' element={<JoinDataView />} />}
        {isLogin && isSession && <Route path='/info' element={<Info />} />}
        {isLogin && isSession && <Route path='/info/term' element={<Term />} />}
      </Routes>
      {isLogin && isSession && <SideMenu />}
    </div>
  ), [isLogin, isSession, conf.programName]);

  return <RoutesMemo />;
}

const Name = Styled.h1`display: none`;