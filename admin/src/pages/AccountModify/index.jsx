import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import Checkbox from '%/Checkbox';
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';

export default function 입출금내역수정 () {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState({});

  const getData = () => {
    useAxios.get('/account/' + id).then(({ data }) => {
      if (!data?.result || !data?.data) {
        useAlert.error('알림', '내역이 존재하지 않습니다.');
        navigate('/account');
        return;
      }
      setData(data?.data);
    })
  }

  const validate = () => {
    // if (!data?.) return useAlert.warn('알림', '제목을 입력해주세요.');
    // if (!data?.) return useAlert.warn('알림', '내용을 입력해주세요.');
    
    submit();
  }

  const submit = () => {
    useAxios.put('/account', { data }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '공지가 수정되었습니다.');
      navigate('/account');
    });
  }

  useEffect(getData, []);

  return (
    <PageAnimate>
      <Header>
        <Title>입출금 내역 수정</Title>
      </Header>
      <Contents>
        <Row>
          <RowTitle>카테고리</RowTitle>
          <RowContents>
            {/* <Input value={title} onChange={e => setTitle(e.target.value)} placeholder='제목을 입력하세요.' /> */}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>내용</RowTitle>
          <RowContents>
            {/* <Textarea value={contents} onChange={e => setContents(e.target.value)} placeholder='내용을 입력하세요.' /> */}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>구분</RowTitle>
          <RowContents>
            {/* <Checkbox checked={} onChange={e => )} /> */}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>금액</RowTitle>
          <RowContents>
            {/* <Checkbox checked={} onChange={e => )} /> */}
          </RowContents>
        </Row>
        <Row style={{ justifyContent: 'flex-start' }}>
          <SubmitBtn onClick={validate}>수 정</SubmitBtn>
          <CancelBtn onClick={() => navigate('/account')}>취 소</CancelBtn>
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