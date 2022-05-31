import React, { useRef, useState, useEffect } from 'react';
import Styled from 'styled-components';
import { BsFillCheckSquareFill, BsFillXSquareFill } from "react-icons/bs";
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';

export default function 이용권카테고리등록 ({ getList, setIsCreate }) {

  const inputRef = useRef(null);
  const [data, setData] = useState({});

  const validate = () => {
    if (!data?.NAME) return useAlert.warn('알림', '카테고리 이름을 입력해주세요.');
    submit();
  }
  
  const submit = () => {
    useAxios.post('/voucherCategory', { data }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '카테고리가 추가되었습니다.');
      setIsCreate(false);
      getList();
    })
  }

  useEffect(() => inputRef.current && inputRef.current.focus(), []);
  
  return (
    <Wrap>
      <Header>
        <Title>
          <Input ref={inputRef} value={data?.NAME ?? ''} 
            onChange={e => setData(prev => ({...prev, NAME: e.target.value}))}
            onKeyUp={e => e.keyCode === 13 && validate()}
          />
        </Title>
        <BtnWrap>
          <CreateBtn onClick={validate} title='카테고리 추가' />
          <CancelBtn onClick={() => setIsCreate(false)} title='취소' />
        </BtnWrap>
      </Header>
      <List>
        <NotLi>해당 카테고리를 생성중입니다.</NotLi>
      </List>
    </Wrap>
  )
}

const Wrap = Styled.li`
  min-width: 470px;
  max-width: 740px;
  min-height: 100px;
  margin-bottom: 30px;
  padding: 0 10px;
`;
const Header = Styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  border-top: 2px solid #00a8a4;
  padding: 10px 0;
`;
const Title = Styled.span`
  font-weight: 500;
  color: #008a87;
  flex: 1;
  margin-right: 10px;
`;
const BtnWrap = Styled.span`
  display: flex;
  align-items: center;
`;
const List = Styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  & > li:last-of-type {
    margin: 0;
  }
`;
const NotLi = Styled.li`
  color: #888;
  font-size: 14px;
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 30px 0;
`;
const CreateBtn = Styled(BsFillCheckSquareFill)`
  width: 26px;
  height: 26px;
  color: #00ada9;
  cursor: pointer;
  &:hover {
    color: #00a8a4;
  }
`;
const CancelBtn = Styled(BsFillXSquareFill).attrs(() => ({ className: 'red' }))`
  width: 26px;
  height: 26px;
  color: #ee6d6d;
  cursor: pointer;
  margin-left: 5px;
  &:hover {
    color: #ec6565;
  }
`;
const Input = Styled.input.attrs(() => ({ placeholder: '카테고리 이름을 입력해주세요' }))`
  width: 100%;
`;