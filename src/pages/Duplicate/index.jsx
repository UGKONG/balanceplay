import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import useAlert from '%/useAlert';
import useStore from '%/useStore';

export default function 이메일중복 () {
  const dispatch = useStore(x => x.setState);
  const location = useLocation();
  const navigate = useNavigate();
  const platform = location?.state?.userPlatform;
  const email = location?.state?.userEmail;
  const platform_ko = platform === 'kakao' ? '카카오' : platform === 'naver' ? '네이버' : null;

  if (!platform || !email || !platform_ko) {
    useAlert.error('오류', '알 수 없는 오류');
    navigate('/login/');
    return null;
  }

  const joinBtnClick = () => {
    dispatch('isLogin', null);
    navigate('/terms/', { state: location?.state});
  }
  const loginNavigate = () => navigate('/login/');


	return (
		<Wrap>
			<Title>이메일 중복</Title>
      <Email>이메일: {email}</Email>
      <Description>
        해당 이메일은 <b>{platform_ko}계정</b>으로 <u>이미 가입된 이메일</u> 입니다.<br />
        기존 회원 정보로 로그인을 희망하시는 경우 {platform_ko}계정으로 로그인해주시고,
        신규가입을 희망하시는 경우 <span>신규가입</span> 버튼을 눌러주세요.
      </Description>
      <JoinBtn onClick={joinBtnClick}>
        신 규 가 입
      </JoinBtn>
      <LoginNavigateBtn onClick={loginNavigate}>
        로그인 페이지로 이동
      </LoginNavigateBtn>
		</Wrap>
	)
}

const Wrap = Styled.main`
  
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
const Email = Styled.p`
  margin: 20px 0 10px;
  color: #555;
  padding: 5px;
  font-style: italic;
`;
const Description = Styled.div`
  background-color: #fff;
  padding: 6px;
  margin-bottom: 30px;
  font-size: 14px;
  color: #333;
  u {
    text-decoration: underline;
  }
  span {
    color: #0eb050;
    font-weight: 700;
  }
`;
const JoinBtn = Styled.button`
  width: 100%;
  margin-bottom: 10px;
  background-color: #0eb050;
`;
const LoginNavigateBtn = Styled.button`
  width: 100%;
  margin-bottom: 10px;
`;