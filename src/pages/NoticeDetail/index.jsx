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
        <Row className='b'>
          <NoticeTitle>
            <SubTitle>제목</SubTitle>{ data?.TITLE }
          </NoticeTitle>
        </Row>
        <Row>
          <Contents>
            <SubTitle>작성자</SubTitle>{ data?.USER }
          </Contents>
          <Contents>
            <SubTitle>작성일</SubTitle>{ data?.DATE }
          </Contents>
        </Row>
        <Col>
          <SubTitle style={{ marginBottom: 6 }}>내용</SubTitle>
          {data?.CONTENT ? (
            <Contents 
              style={{ padding: '0 10px' }}
              dangerouslySetInnerHTML={{ __html: data?.CONTENT }}
            />
          ) : <Contents style={{ color: '#777' }}>내용이 없습니다.</Contents>}
        </Col>
      </ContentsWrap>
    </PageAnimate>
  )
}

const Header = Styled.h2``;
const Title = Styled.span``;
const BackBtn = Styled.button``;
const ContentsWrap = Styled.div`
  padding-top: 10px;
  font-size: 14px;
`;
const Row = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const Col = Styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-flow: column;
  margin-top: 60px;
`;
const NoticeTitle = Styled.p`
  width: 100%;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const SubTitle = Styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 80px;
  min-width: 80px;
  text-indent: 8px;
  font-weight: 500;
  letter-spacing: 1px;
  border-left: 3px solid #00ada9;
`;
const ContentsTitle = Styled.span`
  margin-bottom: 5px;
`;
const Contents = Styled.p`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;