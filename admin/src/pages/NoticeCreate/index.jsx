import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import Checkbox from '%/Checkbox';
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';

export default function 공지작성 () {
  const navigate = useNavigate();
  const [isAdminNotice, setIsAdminNotice] = useState(2);
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  const validate = () => {
    if (!title) return useAlert.warn('공지작성', '제목을 입력해주세요.');
    if (!contents) return useAlert.warn('공지작성', '내용을 입력해주세요.');
    
    submit();
  }

  const submit = () => {
    let data = { isAdminNotice, title, contents };
    useAxios.post('/notice', data).then(({ data }) => {
      if (!data?.result) return useAlert.error('공지등록', data?.msg);
      useAlert.success('공지등록', '공지가 등록되었습니다.');
      navigate('/notice');
    })
    console.log({ title, contents });
  }

  return (
    <PageAnimate>
      <Header>
        <Title>신규 공지 작성</Title>
      </Header>
      <Contents>
        <Row>
          <RowTitle>직원공지</RowTitle>
          <RowContents>
            <Checkbox checked={isAdminNotice === 1} onChange={e => setIsAdminNotice(e ? 1 : 2)} />
          </RowContents>
        </Row>
        <Row>
          <RowTitle>제목</RowTitle>
          <RowContents>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder='제목을 입력하세요.' />
          </RowContents>
        </Row>
        <Row>
          <RowTitle>내용</RowTitle>
          <RowContents>
            <Textarea value={contents} onChange={e => setContents(e.target.value)} placeholder='내용을 입력하세요.' />
          </RowContents>
        </Row>
        <Row style={{ justifyContent: 'flex-start' }}>
          <SubmitBtn onClick={validate}>저 장</SubmitBtn>
          <CancelBtn onClick={() => navigate('/notice')}>취 소</CancelBtn>
        </Row>
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2``;
const Contents = Styled.section``;
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
  width: 100px;
  min-width: 100px;
  max-width: 100px;
`;
const RowContents = Styled.div`
  flex: 1;
  color: #444;
`;
const Input = Styled.input`
  flex: 1;
`;
const Textarea = Styled.textarea`
  flex: 1;
  height: 200px;
`;
const SubmitBtn = Styled.button`
  margin-left: 5px;
  margin-right: 10px;
`;
const CancelBtn = Styled.button`

`;