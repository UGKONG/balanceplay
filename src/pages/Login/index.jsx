import React, { useEffect } from 'react';
import Styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import useAlert from '%/useAlert';
import useStore from '%/useStore';
import useAxios from '%/useAxios';
import kakaoBtn from "~/images/kakaoBtn.png";
import logo from '~/images/logo.svg';

export default function 로그인 () {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useStore(x => x.setState);
  const naverLoginKey = 'H8YDxnXfTpikQKzQWRAk';
  const naverRedirectURL = 'http://192.168.0.90/login';

  //카카오 로그인, 카카오 정보 GET
  const kakaoLogin = () => {
    Kakao.Auth.login({
      success: () => {
        Kakao.API.request({
          url: "/v2/user/me",
          success: (res) => {
            let authId = res?.id ?? null;
            let email = res?.kakao_account?.email ?? null;
            let name = res?.kakao_account?.profile?.nickname ?? null;
            let img = res?.kakao_account?.profile?.thumbnail_image_url ?? null;
            let platform = 'kakao';
            
            snsLoginSubmit({ authId, email, name, platform, img });
          }
        })
      }
    });
  }
  // 네이버 로그인 초기데이터 GET
  const naverLoginInit = () => {
    let naver = new naver_id_login(naverLoginKey, naverRedirectURL);
    let token = naver?.oauthParams?.access_token ?? null;
    let state = naver?.getUniqState();
    naver.setButton("green", 3, 40);
    naver.setState(state);
    naver.init_naver_id_login();
    
    naver && token && naverLogin();
  }
  // 네이버 로그인, 네이버 정보 GET
  const naverLogin = () => {
    let naver = new naver_id_login(naverLoginKey, naverRedirectURL);
    let token = naver?.oauthParams?.access_token ?? null;
    window.naverLoginCallbackFunction = function () {
      let authId = naver.getProfileData("id") ?? null;
      let email = naver.getProfileData("email") ?? null;
      let name = naver.getProfileData("name") ?? null;
      let img = naver.getProfileData("profile_image") ?? null;
      let platform = 'naver';
      
      snsLoginSubmit({ authId, email, name, img, platform });
    }

    naver && token && naver.get_naver_userprofile('naverLoginCallbackFunction()');
  }
  // SNS 로그인
  const snsLoginSubmit = (loginData) => {
    useAxios.post('/snsLogin', loginData).then(
      ({ data }) => {
        if (!data?.result) {
          dispatch('isLogin', null);
          return;
        }

        // 이메일 중복
        if (typeof(data?.data) === 'string') {
          dispatch('isLogin', null);
          navigate('/duplicate/', { state: {
            userAuthId: loginData.authId, userEmail: String(loginData.email), userName: String(loginData.name), 
            userPlatform: String(loginData.platform), userImg: String(loginData.img)
          }});
          useAlert.info('이메일 중복', '다른 플랫폼으로 이미 가입되어있습니다.');
          return;
        }

        // 정보가 아예 없음
        if (!data?.data || !data.data.SCHOOL_TYPE) {
          dispatch('isLogin', null);
          navigate('/terms/', { state: {
            userAuthId: loginData.authId, userEmail: String(loginData.email), userName: String(loginData.name), 
            userPlatform: String(loginData.platform), userImg: String(loginData.img)
          }});
          useAlert.info('신규회원', '회원정보가 없습니다.');
          return;
        }
        snsLoginSuccess(data.data);
      }
    );
  }
  // 최종 로그인
  const snsLoginSuccess = data => {
    useAxios.post('/login', data).then(({ data }) => {
      if (!data?.result) return useAlert.error('로그인', '로그인에 실패하였습니다.');
      dispatch('isLogin', data.data);
      navigate('/');
    });
  }

  // 개발용 로그인
  const devLogin = () => {
    useAxios.post('/devLogin').then(({ data }) => {
      if (!data?.result) return useAlert.error('로그인', '로그인 실패');
      useAlert.success('로그인', '개발자님 환영합니다.');
      navigate('/');
    });
  }

  useEffect(naverLoginInit, []);

  return (
    <Wrap>
      <Logo src={logo} alt='로고' />
      <SnsLoginBtnWrap>
        <KakaoBtn bg={kakaoBtn} onClick={kakaoLogin} />
        <NaverBtn id='naver_id_login' />
      </SnsLoginBtnWrap>
      <DevLoginBtn onClick={devLogin} />
    </Wrap>
  )
}

const Wrap = Styled.main`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  width: 55vw;
  max-width: 300px;
`;
const SnsLoginBtnWrap = Styled.div`

`;
const KakaoBtn = Styled.button`
  background-image: url(${x => x.bg});
  margin: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 200px;
  height: 40px;
  border: 1px solid #f2da00 !important;
  border-radius: 3px;
  margin-bottom: 10px;
`;
const NaverBtn = Styled.div`
  height: 40px;
  width: 200px !important;
  overflow: hidden;
  a, img {
    display: block;
    width: 100%;
  }
`;
const DevLoginBtn = Styled.div`
  position: fixed;
  top: 5px;
  right: 5px;
  width: 85px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #88888840;
  border-radius: 5px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  ::before {
    content: '테스트 로그인';
  }
  &:hover {
    background-color: #88888860;
    color: #333;
  }
  &:active {
    background-color: #88888880;
    color: #111;
  }
`;