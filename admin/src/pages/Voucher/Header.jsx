import React, { useState, useRef, useEffect, useMemo } from 'react';
import Styled from 'styled-components';
import { AiOutlineSearch } from "react-icons/ai";
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';
import useStore from '%/useStore';
import Filter from './Filter';

export default function 이용권해더 ({ list, getList, setList, searchText, setSearchText, isCreate, setIsCreate }) {
  const filtering = useStore(x => x?.temp);
  const [isReset, setIsReset] = useState(false);

  const searchReset = () => {
    setSearchText('');
    getList('');
    setIsReset(prev => !prev);
  }
  
  const totalCount = useMemo(() => {
    let count = 0;
    list?.forEach(x => count += x?.VOUCHER?.length);
    return count;
  }, [list]);

  return (
    <Wrap>
      <Left>
        <Search>
          <Input placeholder='검색어 입력'
            value={searchText} 
            onChange={e => setSearchText(e.target.value)} 
            onKeyDown={e => e.keyCode === 13 && getList()}
          />
          <SearchBtn onClick={getList} />
        </Search>
        <Filter getList={getList} setList={setList} isReset={isReset} />
        {(searchText !== '' || filtering) && (
          <SearchResetBtn onClick={searchReset}>초기화</SearchResetBtn>
        )}
      </Left>
      <Right>
        <Count>
          <span>카테고리 {list?.length ?? 0}개</span>
          <span>이용권 {totalCount ?? 0}개</span>
        </Count>
        {!isCreate && <CategoryCreateBtn onClick={() => setIsCreate(true)}>카테고리 추가</CategoryCreateBtn>}
      </Right>
    </Wrap>
  )
}

const Wrap = Styled.section`
  position: relative;
`;
const Left = Styled.div``;
const Right = Styled.div``;
const Search = Styled.div`
  position: relative;
`;
const Input = Styled.input`
  width: 20vw;
  min-width: 160px;
  max-width: 360px;
  height: 32px !important;
`;
const SearchBtn = Styled(AiOutlineSearch)`
  width: 32px;
  height: 32px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  color: #777;
  padding: 6px;
  cursor: pointer;
`;
const SearchResetBtn = Styled.button`
  margin-left: 10px;
`;
const Count = Styled.div`
  margin-left: 16px;
  font-size: 12px;
  color: #555;
  align-self: stretch;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px 2px 6px;
    border-left: 3px solid #00ada9;
  }
`;
const CategoryCreateBtn = Styled.button``;