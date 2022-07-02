import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import MemberLi from './MemberLi';
import Header from './Header';
import Loading from '@/pages/Common/Loading';

export default function 회원페이지 ({ setUserId }) {
  const head = [
    { name: 'No', width: 60 }, 
    { name: '이름', width: '15%' }, 
    { name: '성별', width: '10%' }, 
    { name: '신장', width: '10%' }, 
    { name: '체중', width: '10%' }, 
    { name: '활성화 이용권', width: '15%' }, 
    { name: '테스트 허가', width: '15%' }, 
    { name: '가입 플랫폼', width: '15%' }, 
    { name: '가입일', width: '15%' },
  ];
  const [isLoad, setIsLoad] = useState(true);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');

  const getList = (text, callback = null) => {
    useAlert?.info('알림', '회원을 선택해주세요.');
    let temp = text ?? searchText;
    useAxios.get('/member?q=' + temp).then(({ data }) => {
      setIsLoad(false);
      if (!data?.result || !data?.data) return setList([]);
      if (data?.data?.length === 0) {
        return useAlert.info('검색결과', '검색결과가 없습니다.');
      }
      
      (callback ? callback : setList)(data?.data);
    })
  }

  return (
    <PageAnimate name='slide-up'>
      <Header 
        list={list} 
        getList={getList} 
        setList={setList}
        searchText={searchText} 
        setSearchText={setSearchText} 
      />
      <Contents>
        {isLoad ? <Loading /> : (
          <Table>
            <Thead>
              <Tr>
                {head?.map((item, i) => <Th key={i} style={{ width: item?.width }}>{item?.name}</Th>)}
              </Tr>
            </Thead>
            <Tbody>
              {list?.map((item, i) => <MemberLi key={i} idx={i} item={item} setUserId={setUserId} />)}
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
const Th = Styled.th`
  &:nth-of-type(4) {
    min-width: 100px;
  }
`;