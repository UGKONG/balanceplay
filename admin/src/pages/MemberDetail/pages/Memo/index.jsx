import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';
import MemoLi from './MemoLi';

export default function 메모 ({ memo }) {
  const params = useParams();
  const userId = params?.id;
  const [list, setList] = useState([]);
  const [value, setValue] = useState('');
  const [memoEdit, setMemoEdit] = useState(false);
  const [editMemo, setEditMemo] = useState(memo);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const memoRef = useRef(null);

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
  const memoSave = () => {
    useAxios.put('/userDefaultMemo/' + userId, { memo: editMemo }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '저장되었습니다.');
      setMemoEdit(false);
      inputRef?.current?.focus();
    })
  }
  const defaultMemoEdit = () => {
    memoEdit && memoRef.current?.focus();
  }

  useEffect(getList, []);
  useEffect(defaultMemoEdit, [memoEdit]);

  return (
    <PageAnimate name='slide-up' 
      style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}
    >
      <DefaultMemo>
        <DefaultMemoTitle>
          회원 기본 메모 {memoEdit && ' (수정중..)'}
          <SaveBtn onClick={!memoEdit ? (() => setMemoEdit(true)) : memoSave}>
            {!memoEdit ? '수정' : '저장'}
          </SaveBtn>
        </DefaultMemoTitle>
        <Memo>
          {!memoEdit ? (
            <pre>{editMemo}</pre>
          ) : (
            <textarea ref={memoRef} 
              defaultValue={editMemo} 
              onChange={e => setEditMemo(e.target.value)} 
              placeholder='회원의 메모사항을 적어주세요.'
            />
          )}
        </Memo>
      </DefaultMemo>
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

const DefaultMemo = Styled.article`
  padding: 10px;
  border-bottom: 1px solid #b9e1dc;
  margin-bottom: 10px;
`;
const DefaultMemoTitle = Styled.p`
  font-size: 14px;
  padding: 2px 3px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Memo = Styled.div`
  font-size: 13px;
  height: 60px;
  overflow: hidden;
  display: block !important;
  overflow: auto;
  pre {
    width: 100%;
    height: 100%;
    white-space: pre-wrap;
    padding: 6px;
    background-color: #fff;
    border: 1px solid #c9ebe7;
  }
  textarea {
    width: 100%;
    height: 100%;
    border: 1px solid transparent;
    padding: 6px;
    border: 1px solid #c9ebe7;
    &:focus {
      border: 2px solid #00ada9 !important;
    }
  }
`;
const SaveBtn = Styled.button`

`;
const MemoList = Styled.ul`
  flex: 1;
  /* height: 100%; */
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