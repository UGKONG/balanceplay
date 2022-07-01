import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import NoticeLi from './NoticeLi';
import Header from './Header';
import TableCheckbox from '../Common/TableCheckbox';
import Loading from '@/pages/Common/Loading';

export default function 공지사항 () {
  const head = useRef([
    { name: 'No', width: 60 }, 
    { name: '구분', width: 100 }, 
    { name: '제목', width: '35%' }, 
    { name: '내용', width: '65%' }, 
    { name: '작성자', width: 100 }, 
    { name: '작성일', width: 150 }
  ]);
  const [isLoad, setIsLoad] = useState(true);
  const [list, setList] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeType, setActiveType] = useState(3);

  const getList = (text, callback = null) => {
    let temp = text ?? searchText;
    setCheckList([]);
    useAxios.get('/notice?q=' + temp).then(({ data }) => {
      setIsLoad(false);
      if (!data?.result || !data?.data) return setList([]);
      if (data?.data?.length === 0) {
        return useAlert.info('검색결과', '검색결과가 없습니다.');
      }
      (callback ? callback : setList)(data?.data);
    });
  }

  const allCheck = bool => setCheckList(bool ? [...list] : []);

  return (
    <PageAnimate name='slide-up'>
      <Header 
        list={list} 
        getList={getList} 
        setList={setList} 
        checkList={checkList} 
        searchText={searchText} 
        setSearchText={setSearchText}
        activeType={activeType}
        setActiveType={setActiveType}
      />
      <Contents>
        {isLoad ? <Loading /> : (
          <Table>
            <Thead>
              <Tr>
                <Th style={{ width: 42 }}>
                  <TableCheckbox 
                    checked={checkList?.length > 0 && (checkList?.length === list?.length)} 
                    onChange={allCheck}
                  />
                </Th>
                {head.current?.map((item, i) => <Th key={i} style={{ width: item?.width }}>{item?.name}</Th>)}
              </Tr>
            </Thead>
            <Tbody>
              {list?.map((item, i) => <NoticeLi key={i} idx={i} item={item} checkList={checkList} setCheckList={setCheckList} />)}
            </Tbody>
          </Table>
        )}
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