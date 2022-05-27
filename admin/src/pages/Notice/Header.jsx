import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';

export default function 공지해더 ({ activeType, setActiveType, count, getList, checkList, searchText, setSearchText }) {
  const navigate = useNavigate();
  const typeList = useRef([
    { id: 2, text: '전체' },
    { id: 0, text: '회원용' },
    { id: 1, text: '선생님용' },
  ]);

  const typeClick = id => setActiveType(id);
  const searchReset = () => {
    setSearchText('');
    getList('');
  }
  const noticeDelete = () => {
    let ask = confirm('선택된 ' + checkList?.length + '개의 항목을 삭제하시겠습니까?');
    if (!ask) return;
    let idArr = checkList?.map(x => x.ID);
    
    useAxios.delete('/notice', { data: { idArr } }).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('공지삭제', checkList?.length + '개의 항목이 삭제되지 않았습니다.');
        return;
      }
      useAlert.success('공지삭제', checkList?.length + '개의 항목이 삭제되었습니다.');
      getList();
    });
  }

  useEffect(getList, [activeType]);

  return (
    <Wrap>
      <Left>
        <Search>
          <Input placeholder='검색어 입력' 
            value={searchText} 
            onChange={e => setSearchText(e.target.value)} 
            onKeyDown={e => e.keyCode === 13 && getList()}
          />
          <SearchBtn onClick={() => getList()} />
        </Search>
        {searchText !== '' && (
          <SearchResetBtn onClick={searchReset}>검색 초기화</SearchResetBtn>
        )}
        <Category>
          {typeList?.current?.map(item => (
            <span key={item?.id} 
              className={activeType === item?.id ? 'active' : ''}
              onClick={() => typeClick(item?.id)}
            >{item?.text}</span>
          ))}
        </Category>
      </Left>
      <Right>
        <Count>
          <span>전체 {count}개</span>
          <span>선택 {checkList?.length ?? 0}개</span>
        </Count>
        <CreateBtn onClick={() => navigate('new')}>공지 작성</CreateBtn>
        {checkList?.length !== 0 && <DeleteBtn onClick={noticeDelete}>선택 삭제</DeleteBtn>}
      </Right>
    </Wrap>
  )
}

const Wrap = Styled.section``;
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
const Category = Styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  margin-left: 10px;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  & > span {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    border-right: 1px solid #ddd;
    color: #777;
    cursor: pointer;
    &:last-of-type {
      border-right: none;
    }
    &:hover {
      background-color: #00ada912;
    }
    &.active {
      background-color: #00ada9;
      color: #fff;
    }
  }
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
const CreateBtn = Styled.button`

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