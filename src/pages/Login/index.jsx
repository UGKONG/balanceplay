import React from 'react';
import Styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useAlert from '%/useAlert';
import useStore from '%/useStore';
import useAxios from '%/useAxios';
import kakaoBtn from "~/images/kakaoBtn.png";
import logo from "~/images/logo.svg";

export default function () {
  const navigate = useNavigate();
  const dispatch = useStore(x => x.setState);

  // 최종 SNS 로그인
  const snsLoginSubmit = ({ authId, email, name, platform, img }) => {
    useAxios.post('/snsLogin', { authId, email, name, platform, img }).then(
      ({ data }) => {
        if (!data?.result) {
          dispatch('isLogin', null);
          return;
        }
        if (!data?.data || !data.data.SCHOOL_TYPE) {
          dispatch('isLogin', null);
          useAlert.info('신규회원', '회원정보가 없습니다.');
          navigate('/terms/', { state: {
            userAuthId: String(authId), userEmail: String(email), userName: String(name), 
            userPlatform: String(platform), userImg: String(img)
          }});
          return;
        }
        if (typeof(data.data) === 'string') {
          dispatch('isLogin', null);
          useAlert.info('이메일 중복', '다른 플랫폼으로 이미 가입되어있습니다.');
          navigate('/duplicate', { state: { email: data.data }});
          return;
        }
        snsLoginSuccess(data.data);
      }
    );
  }
  // SNS 로그인 성공
  const snsLoginSuccess = data => {
    useAxios.post('/login', data).then(({ data }) => {
      if (!data?.result) return useAlert.error('로그인', '로그인에 실패하였습니다.');
      dispatch('isLogin', data.data);
      navigate('/');
    });

  }
  //카카오 로그인, 카카오 정보 GET
  const kakaoLogin = () => {
    Kakao.Auth.login({
      success: (res) => (() => {
        Kakao.API.request({
          url: "/v2/user/me",
          success: (res) => {
            let authId = res?.id ?? null;
            let email = res?.kakao_account?.email ?? null;
            let name = res?.kakao_account?.profile?.nickname ?? null;
            let img = res?.kakao_account?.profile?.thumbnail_image_url ?? null;
            let platform = 'kakao';
            
            snsLoginSubmit({ authId, email, name, platform, img });
          },
          fail: (err) => {
            console.log("로그인은 되었지만 토큰이 없습니다.");
          }
        })
      })()
    })
  }

  return (
    <Wrap>
      <img src={logo} alt='로고' />
      <KakaoBtn bg={kakaoBtn} onClick={kakaoLogin} />
      <NaverBtn id='naver_id_login' />
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
  padding: 0 !important;
  transform: unset;
  background-color: #f1f9f8;

  img {
    width: 200px;
    margin-bottom: 180px;
  }

  button {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 185px;
    height: 40px;
    border: 1px solid #f2da00 !important;
    border-radius: 3px;
    margin-bottom: 10px;
  }
`
const KakaoBtn = Styled.button`
  background-image: url(${x => x.bg});
`;
const NaverBtn = Styled.div`
  
`