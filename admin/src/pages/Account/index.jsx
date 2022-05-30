import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import AccountLi from './AccountLi';
import Header from './Header';
import TableCheckbox from '../Common/TableCheckbox';

export default function 입출금내역 () {
  const head = [
    { name: 'No', width: 60 }, 
    { name: '일시', width: '15%' }, 
    { name: '구분', width: '10%' }, 
    { name: '세부내용', width: '55%' }, 
    { name: '입금액', width: '10%' }, 
    { name: '출금액', width: '10%' },
  ];
  const [list, setList] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [searchText, setSearchText] = useState('');

  const getList = (text, callback = null) => {
    let temp = text ?? searchText;
    setCheckList([]);
    useAxios.get('/account?q=' + temp).then(({ data }) => {
      if (!data?.result || !data?.data) return setList([]);
      if (data?.data?.length === 0) {
        setSearchText('');
        searchText !== '' && useAlert.info('검색결과', '검색결과가 없습니다.');
        return;
      }
      
      (callback ? callback : setList)(data?.data);
    })
  }

  const allCheck = bool => setCheckList(bool ? [...list?.filter(x => x?.IS_AUTO === 0)] : []);

  useEffect(getList, []);

  return (
    <PageAnimate name='slide-up'>
      <Header 
        list={list} 
        getList={getList} 
        setList={setList} 
        checkList={checkList} 
        searchText={searchText} 
        setSearchText={setSearchText} 
      />
      <Contents>
        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: 42 }}>
                <TableCheckbox checked={
                  list?.filter(x => x?.IS_AUTO === 0)?.length > 0 && 
                  checkList?.length === list?.filter(x => x?.IS_AUTO === 0)?.length
                } onChange={allCheck} />
              </Th>
              {head?.map((item, i) => <Th key={i} style={{ width: item?.width }}>{item?.name}</Th>)}
              <Th style={{ width: 70 }} />
            </Tr>
          </Thead>
          <Tbody>
            {list?.map((item, i) => <AccountLi key={i} idx={i} item={item} checkList={checkList} setCheckList={setCheckList} />)}
          </Tbody>
        </Table>
      </Contents>
    </PageAnimate>
  )
}

const Contents = Styled.section`
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
`;
const Table = Styled.table``;
const Thead = Styled.thead``;
const Tbody = Styled.tbody``;
const Tr = Styled.tr``;
const Th = Styled.th``;