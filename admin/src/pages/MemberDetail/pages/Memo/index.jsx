import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';
import MemoLi from './MemoLi';

export default function 메모 () {
  const params = useParams();
  const userId = params?.id;
  const [list, setList] = useState([]);
  const [value, setValue] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const getList = () => {
    useAxios.get('/userMemo/' + userId).then(({ data }) => {
      inputRef?.current?.focus();
      if (!data?.result) return setList([]);
      setList(data?.data);
      listRef.current.scrollTop = listRef.current.scrollHeight;
    })
  }
  const submit = () => {
    if (value?.trim() === '') return inputRef?.current?.focus();
    useAxios.post('/userMemo/' + userId, { value }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      getList();
      setValue('');
    })
  }

  useEffect(getList, []);

  return (
    <PageAnimate name='slide-up' 
      style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}
    >
      <MemoList ref={listRef}>
        {list?.length === 0 && <NotLi>리스트가 없습니다.</NotLi>}
        {list?.map(item => (
          <MemoLi key={item?.ID} data={item} getList={getList} />
        ))}
      </MemoList>
      <InputWrap>
        <Input ref={inputRef} value={value} 
          onChange={e => setValue(e.target.value)} 
          onKeyUp={e => e.keyCode === 13 && submit()}
        />
        <SubmitBtn onClick={submit}>저장</SubmitBtn>
      </InputWrap>
    </PageAnimate>
  )
}

const MemoList = Styled.ul`
  flex: 1;
  height: 100%;
  padding: 10px 10px 0;
  align-self: stretch;
  overflow-x: hidden;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #b8d0cd;
  }
`;
const InputWrap = Styled.div`
  padding: 10px;
  border-top: 1px solid #b9e1dc;
`;
const Input = Styled.input`
  height: 32px !important;
  flex: 1;
  margin-right: 10px;
`;
const SubmitBtn = Styled.button``;
const NotLi = Styled.li`
  color: #888;
  font-size: 14px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;