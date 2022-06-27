import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';
import MemoLi from './MemoLi';
import HistoryLi from './HistoryLi';

export default function 메모 ({ memo }) {
  const params = useParams();
  const userId = params?.id;
  const [list, setList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [value, setValue] = useState('');
  const [memoEdit, setMemoEdit] = useState(false);
  const [editMemo, setEditMemo] = useState(memo);
  const historyListRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const memoRef = useRef(null);

  const getHistoryList = () => {
    useAxios.get('/userHistory/' + userId).then(({ data }) => {
      if (!data?.result) return setHistoryList([]);
      setHistoryList(data?.data);
      historyListRef.current.scrollTop = historyListRef.current.scrollHeight;
    })
  }
  const getList = () => {
    useAxios.get('/userMemo/' + userId).then(({ data }) => {
      inputRef?.current?.focus();
      if (!data?.result) return setList([]);
      setList(data?.data);
      listRef.current.scrollTop = listRef.current.scrollHeight;
      getHistoryList();
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
        <Left>
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
        </Left>
        <Right ref={historyListRef}>
          {historyList?.length === 0 && <NotLi>히스토리가 없습니다.</NotLi>}
          {historyList?.map(item => (
            <HistoryLi key={item?.ID} data={item} />
          ))}
        </Right>
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
  border-bottom: 1px solid #b9e1dc;
  display: flex;
  & > div {
    display: flex;
    padding: 10px;
    flex-direction: column;
    align-items: flex-start !important;
    height: 124px;
  }
`;
const Left = Styled.div`
  padding-right: 5px;
  border-right: 1px solid #b9e1dc;
  width: 50%;
`;
const Right = Styled.div`
  width: 50%;
  padding-left: 5px;
  overflow: auto;
`;
const DefaultMemoTitle = Styled.p`
  font-size: 14px;
  padding: 2px 3px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const Memo = Styled.div`
  width: 100%;
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;