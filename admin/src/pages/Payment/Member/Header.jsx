import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import { AiOutlineSearch } from "react-icons/ai";
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';
import useStore from '%/useStore';
import Filter from './Filter';

export default function 회원해더 ({ list, getList, setList, searchText, setSearchText }) {
  const navigate = useNavigate();
  const filtering = useStore(x => x?.temp);
  const [isReset, setIsReset] = useState(false);

  const searchReset = () => {
    setSearchText('');
    getList('');
    setIsReset(prev => !prev);
  }

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
          <span>전체 {list?.length ?? 0}개</span>
          <button onClick={() => navigate(-1)}>결제 닫기</button>
        </Count>
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
const DeleteBtn = Styled.button`
  border: 1px solid #ff4f4f !important;
  background-color: #ee6d6d !important;
  &:hover {
    background-color: #ec6565 !important;
  }
  &:focus {
    box-shadow: 0 0 0 4px rgb(238 109 109 / 25%) !important;
  }
`;
const MemberListDownloadBtn = Styled.button`
`;