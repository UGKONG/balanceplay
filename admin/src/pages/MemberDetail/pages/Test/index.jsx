import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';

export default function 검사데이터 () {

  const [list, setList] = useState([]);

  return (
    <PageAnimate name='slide-up' style={{ overflow: 'auto' }}>
      <Header>
        <TestName>

        </TestName>
        <NewTestBtn>신규 검사</NewTestBtn>
      </Header>
      <TestList>
        {list?.length === 0 && <NotLi>검사 리스트가 없습니다.</NotLi>}
        {/* {list?.map(item => (
          <VoucherLi key={item?.ID} data={item} getList={getList} />
        ))} */}
      </TestList>
    </PageAnimate>
  )
}

const Header = Styled.div`
  height: 44px;
  padding: 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const TestList = Styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  width: 100%;
  height: calc(100% - 44px);
`;
const NotLi = Styled.li`
  color: #888;
  font-size: 14px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const TestName = Styled.select`
  min-width: 100px;
  height: 32px;
`;
const NewTestBtn = Styled.button`

`;