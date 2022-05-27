import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import useStore from '%/useStore';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import logo from '~/images/logo.png';

export default function 로그인페이지 () {
  const navigate = useNavigate();
  const dispatch = useStore(x => x.setState);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const submit = e => {
    e.preventDefault();
    useAxios.post('/adminLogin', { id, pw }).then(({ data }) => {
      if (!data?.result || adminData) {
        dispatch('isLogin', null);
        useAlert.error('로그인', data?.msg || '일치하는 관리자가 없습니다.');
        return;
      }
      let adminData = data?.data;
      adminData && useAlert.success('알림', adminData?.NAME + '님 환영합니다.');
      dispatch('isLogin', adminData);
      navigate('/');
    });
    return false;
  }

  return (
    <Wrap>
      <Logo src={logo} alt='로고' />
      <Form onSubmit={submit}>
        <Input field='id' type='text' placeholder='아이디' onChange={e => setId(e.target.value)} />
        <Input field='pw' type='password' placeholder='비밀번호' onChange={e => setPw(e.target.value)} />
        <Submit type='submit'>전 송</Submit>
      </Form>
    </Wrap>
  )
}

const Wrap = Styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: unset !important;
  transform: unset;
  background-color: #f1f9f8;
  padding: 150px 0 100px !important;
  overflow: hidden;
`;
const Logo = Styled.img`
  width: 40vw;
  min-width: 180px;
  max-width: 300px;
  margin-bottom: 70px;
`;
const Form = Styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
`;
const Input = Styled.input`
  width: 40vw;
  min-width: 180px;
  max-width: 300px;
  padding: 0 16px !important;
  height: 50px !important;
  border-radius: 10px !important;
  border-top-left-radius: ${x => x.field === 'pw' && 0} !important;
  border-top-right-radius: ${x => x.field === 'pw' && 0} !important;
  border-bottom-left-radius: ${x => x.field === 'id' && 0} !important;
  border-bottom-right-radius: ${x => x.field === 'id' && 0} !important;
  border-top: ${x => x.field === 'pw' && 'none'} !important;
`;
const Submit = Styled.button`
  border-radius: 10px !important;
  height: 40px !important;
  width: 40vw;
  min-width: 180px;
  max-width: 300px;
  margin-top: 50px;
  letter-spacing: 2px;
  font-size: 14px;
`;