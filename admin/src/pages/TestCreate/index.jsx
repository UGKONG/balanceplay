import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function 신규검사 () {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const userId = Number(params?.id ?? null);
  const testTypeId = Number(location?.state?.testTypeId ?? null);

  if (!testTypeId || !userId) {
    navigate(userId ? ('/member/' + userId) : -1);
    return null;
  }
  console.log({testTypeId,userId});

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>신규검사</Title>
        <BackBtn onClick={() => navigate(-1)}>뒤로가기</BackBtn>
      </Header>
      <Contents>
        testTypeId: {testTypeId}<br />
        userId: {userId}
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2``;
const BackBtn = Styled.button``;
const Contents = Styled.section`
  display: flex;
  flex-direction: column;
`;