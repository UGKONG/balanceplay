import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function 공지상세페이지 () {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState(null);

  const getData = () => {
    useAxios.get('/notice/' + id).then(({ data }) => {
      if (!data?.result || !data?.data) {
        useAlert.error('공지 데이터', '게시글이 존재하지 않습니다.');
        return navigate('/notice');
      }
      setData(data?.data);
    })
  }

  const edit = () => {
    navigate('/noticeModify/' + id);
  }

  const del = () => {
    let ask = confirm('해당 공지를 삭제하시겠습니까?');
    if (!ask) return;
    
    useAxios.delete('/notice', { data: { idArr: [id] } }).then(({ data }) => {
      if (!data?.result) return useAlert.error('공지삭제', data?.msg);
      useAlert.success('공지삭제', '삭제가 완료되었습니다.');
      navigate('/notice');
    });
  }

  useEffect(getData, []);

  if (!data) return null;

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>공지사항 상세보기</Title>
        <OptionBtnWrap>
          <EditBtn onClick={edit}>수정</EditBtn>
          <DeleteBtn onClick={del}>삭제</DeleteBtn>
          <BackBtn onClick={() => navigate('/notice')}>뒤로가기</BackBtn>
        </OptionBtnWrap>
      </Header>
      <Contents>
        <Row>
          <RowTitle>제목</RowTitle>
          <RowContents>{data?.TITLE}</RowContents>
        </Row>
        <Row>
          <RowTitle>작성일</RowTitle>
          <RowContents>{data?.DATE}</RowContents>
        </Row>
        <Row>
          <RowTitle>작성자</RowTitle>
          <RowContents>{data?.USER}</RowContents>
        </Row>
        <Row style={{ marginTop: 50 }}>
          <RowTitle style={{ minWidth: '100%' }}>내용</RowTitle>
          <RowContentsText 
            dangerouslySetInnerHTML={{ __html: data?.CONTENT }} 
            style={{ 
              width: '100%', marginTop: 10, paddingLeft: 10
            }} 
          />
        </Row>
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2`
  
`;
const Contents = Styled.section``;
const OptionBtnWrap = Styled.span``;
const EditBtn = Styled.button``;
const DeleteBtn = Styled.button`
  border: 1px solid #ff4f4f !important;
  background-color: #ee6d6d !important;
  &:hover {
    background-color: #ec6565 !important;
  }
  &:focus {
    box-shadow: 0 0 0 4px rgb(238 109 109 / 25%) !important;
  }
`;
const BackBtn = Styled.button`
  
`;
const Row = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 30px;
  width: 100%;
  font-size: 14px;
`;
const RowTitle = Styled.p`
  border-left: 3px solid #00ada9;
  letter-spacing: 1px;
  font-weight: 500;
  text-indent: 8px;
  width: 80px;
  min-width: 80px;
  max-width: 80px;
`;
const RowContents = Styled.div`
  flex: 1;
  color: #444;
`;
const RowContentsText = Styled.pre`
  flex: 1;
  color: #444;
`;