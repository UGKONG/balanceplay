import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import PageAnimate from '%/PageAnimate';
import NoticeLi from './NoticeLi';

export default function () {
  const [list, setList] = useState([]);
  const theadList = useRef(['No', '제목', '작성일']);

  const getList = () => {
    useAxios.get('/notice').then(({ data }) => {
      if (!data.result) return setList([]);

      setList(data?.data);
    });
  }

  useEffect(getList, []);

  return (
    <PageAnimate name='slide-up'>
      <h2>공지사항</h2>
      <Table>
        <thead>
          <tr>
            {theadList.current.map((item, i) => <th key={i}>{item}</th>)}
          </tr>
        </thead>
        <tbody>
          {list && list.map((item, i) => (
            <NoticeLi key={i} item={item} idx={i} />
          ))}
        </tbody>
      </Table>
    </PageAnimate>
  )
}

const Table = Styled.table`
  th {
    &:nth-of-type(1) {
      width: 70px;
    }
    &:nth-of-type(2) {
      width: auto;
    }
    &:nth-of-type(3) {
      width: 120px;
    }
  }
`;