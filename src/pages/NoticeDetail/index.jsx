import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '%/useAxios';
import PageAnimate from '%/PageAnimate';

export default function 공지상세 () {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const id = params?.id;

  const getData = () => {
    useAxios.get('/notice/' + id).then(({ data }) => {
      if (!data.result) return setData(null);
      setData(data?.data);
    });
  }

  useEffect(getData, []);

  if (!data) return null;
  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>공지사항 상세보기</Title>
        <BackBtn onClick={() => navigate(-1)}>뒤로가기</BackBtn>
      </Header>
      <ContentsWrap>
        <Row>

        </Row>
        <Row className='b'>
          <NoticeTitle>제목 : { data?.TITLE }</NoticeTitle>
        </Row>
        <Row>
          <Contents>게시물 번호 : { data?.ID }</Contents>
        </Row>
        <Row>
          <Contents>작성자 : { data?.USER }</Contents>
          <Contents>작성일 : { data?.DATE }</Contents>
        </Row>
        <Col>
          <ContentsTitle>내용</ContentsTitle>
          <Contents 
            dangerouslySetInnerHTML={{ __html: data?.CONTENT ?? '' }}
          />
        </Col>
      </ContentsWrap>
    </PageAnimate>
  )
}

const Header = Styled.h2``;
const Title = Styled.span``;
const BackBtn = Styled.button``;
const ContentsWrap = Styled.div`
  font-size: 14px;
`;
const Row = Styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;
const Col = Styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-flow: column;
  margin-top: 30px;
`;
const NoticeTitle = Styled.p`
  font-size: 16px;
  font-weight: 500;
`;
const ContentsTitle = Styled.span`
  margin-bottom: 5px;
`;
const Contents = Styled.p``;