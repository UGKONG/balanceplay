import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import Header from './Header';
import CategoryLi from './CategoryLi';
import Loading from '@/pages/Common/Loading';

export default function 이용권 ({ setVoucherId }) {
  const [isLoad, setIsLoad] = useState(true);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');

  const getList = (text, callback = null) => {
    let temp = text ?? searchText;
    useAxios.get('/voucher?q=' + temp).then(({ data }) => {
      setIsLoad(false);
      if (!data?.result || !data?.data) return setList([]);
      if (data?.data?.length === 0) {
        return useAlert.info('검색결과', '검색결과가 없습니다.');
      }
      
      (callback ?? setList)(data?.data);
    })
  }

  useEffect(() => useAlert?.info('알림', '이용권을 선택해주세요.'), []);

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
          <CategoryList>
            {list?.map(item => (
              <CategoryLi key={item?.ID} data={item} getList={getList} setVoucherId={setVoucherId} />
            ))}
          </CategoryList>
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
const CategoryList = Styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-right: 5px;
  width: 100%;
  height: 100%;
`;