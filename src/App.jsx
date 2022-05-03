import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Styled from 'styled-components';
import { programName } from '../server/config.json';
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
import DoSurvey from '@/pages/Survey/DoSurvey';
import Notice from '@/pages/Notice';
import NoticeDetail from '@/pages/NoticeDetail';

export default function App() {
  const dispatch = useStore(x => x.setState);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSession, setIsSession] = useState(false);
  useTitle(programName);
  
  const sessionChk = () => {
    let path = location.pathname;
    if (
      path.indexOf('login') > -1 || 
      path.indexOf('join') > -1 || 
      path.indexOf('duplicate') > -1 || 
      path.indexOf('terms') > -1
    ) return;

    useAxios.get('/isSession').then(({ data }) => {
      if (!data.result) {
        setIsSession(false);
        dispatch('isLogin', null);
        navigate('/login/');
        return;
      }
      setIsSession(true);
      dispatch('isLogin', data?.data);
    });
  }
  
  useEffect(sessionChk, [location]);

  const tag = useMemo(() => (
    <div id='wrap'>
      <Name>{programName}</Name>
      {isSession && <Header programName={programName} />}
      <Routes>
        <Route path='/terms' element={<Terms />} />
        <Route path='/login' element={<Login />} />
        <Route path='/join' element={<Join />} />
        <Route path='/duplicate' element={<Duplicate />} />
        {isSession && <Route path='/' element={<Home />} />}
        {isSession && <Route path='/totalresult/:id' element={<TotalResult />} />}
        {isSession && <Route path='/survey/:id' element={<Survey />} />}
        {isSession && <Route path='/survey/:id/new' element={<DoSurvey />} />}
        {isSession && <Route path='/notice' element={<Notice />} />}
        {isSession && <Route path='/notice/:id' element={<NoticeDetail />} />}
      </Routes>
      <SideMenu />
    </div>
  ), [isSession, programName]);

  return tag;
}

const Name = Styled.h1`display: none`;