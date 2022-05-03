import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '%/useAxios';
import PageAnimate from '%/PageAnimate';

export default function ({ item, idx }) {
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
      <h1>
        공지사항 상세보기
        <button class="btn" onClick={() => navigate('/notice/')}>뒤로가기</button>
      </h1>
      <Contents>
        <div className='row b'>
          <p>제목 : { data?.TITLE }</p>
        </div>
        <div className='row'>
          <p>게시물 번호 : { data?.ID }</p>
        </div>
        <div className='row'>
          <p>작성자 : { data?.USER }</p>
          <p>작성일 : { data?.DATE }</p>
        </div>
        <div className='col'>
          <span>내용</span>
          <p>{data?.CONTENT}</p>
        </div>
      </Contents>
    </PageAnimate>
  )
}

const Contents = Styled.div`
  font-size: 14px;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .b {
    font-size: 16px;
  }
  .col {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-flow: column;
    margin-top: 30px;

    span {
      margin-bottom: 5px;
    }
  }
`;