import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import { BsFillPlusSquareFill, BsFillXSquareFill } from "react-icons/bs";
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';
import VoucherLi from './VoucherLi';
import VoucherCreate from './VoucherCreate';

export default function 카테고리리스트 ({ data, getList }) {

  const categoryNameRef = useRef(null);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryName, setCategoryName] = useState(data?.NAME);

  const categoryDelete = () => {
    if (data?.VOUCHER?.length > 0) return useAlert.warn('알림', '해당 카테고리에 이용권이 존재합니다.');
    let ask = confirm('해당 카테고리를 삭제하시겠습니까?');
    if (!ask) return;

    useAxios.delete('/voucherCategory/' + data?.ID).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '해당 이용권 카테고리가 삭제되었습니다.');
      getList();
    });
  }
  const categoryNameValidate = () => {
    if (!categoryName) {
      categoryNameRef?.current?.focus();
      useAlert.warn('알림', '카테고리 이름을 입력해주세요.');
      return;
    }
    if (data?.NAME === categoryName) {
      setIsEdit(false);
      return;
    }
    categoryNameSubmit();
  }
  const categoryNameSubmit = () => {
    useAxios.put('/voucherCategory/' + data?.ID, { name: categoryName }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '카테고리 이름이 수정되었습니다.');
      setIsEdit(false);
      getList();
    })
  }

  useEffect(() => isEdit && categoryNameRef?.current?.focus(), [isEdit]);

  return (
    <Wrap>
      <Header>
        {isEdit ? (
          <CategoryNameInput 
            ref={categoryNameRef} 
            value={categoryName} 
            onChange={e => setCategoryName(e.target.value)}
            onBlur={categoryNameValidate}
            onKeyUp={e => e.keyCode === 13 && categoryNameValidate()}
            placeholder='카테고리 이름을 입력해주세요.'
          />
        ) : (
          <Title title='카테고리 이름 수정' onClick={() => setIsEdit(true)}>
            {data?.NAME}
          </Title>
        )}
        {!isCreate && !isEdit && (
          <HeaderBtnWrap>
            <VoucherCreateBtn onClick={() => setIsCreate(true)} title='이용권 추가' />
            {data?.VOUCHER?.length === 0 && <CategoryDeleteBtn onClick={categoryDelete} title='카테고리 삭제' />}
          </HeaderBtnWrap>
        )}
      </Header>
      <List>
        {!isCreate && data?.VOUCHER?.length === 0 && <NotLi>해당 카테고리에 이용권이 없습니다.</NotLi>}
        {data?.VOUCHER?.sort((a, b) => a?.ID - b?.ID)?.map(item => (
          <VoucherLi key={item?.ID} data={item} getList={getList} />
        ))}
        {isCreate && <VoucherCreate getList={getList} setIsCreate={setIsCreate} categoryId={data?.ID} />}
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
const HeaderBtnWrap = Styled.span`
  display: flex;
  align-items: center;
`;
const Title = Styled.span`
  font-weight: 500;
  color: #008a87;
  cursor: text;
  border: 1px solid #dddddd00;
  border-radius: 3px;
  height: 30px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &::after {
    content: '이름 수정';
    font-size: 12px;
    color: #999;
    position: absolute;
    top: 50%;
    left: calc(100% + 5px);
    transform: translateY(-50%);
    white-space: nowrap;
    display: none;
  }
  &:hover {
    border: 1px solid #ddd;
    background-color: #fff;
    font-size: 13px;
    &::after {
      display: block;
    }
  }
`;
const CategoryNameInput = Styled.input`
  font-weight: 500;
  color: #008a87;
  border: 1px solid #ddd;
  flex: 1;
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
const VoucherCreateBtn = Styled(BsFillPlusSquareFill)`
  width: 26px;
  height: 26px;
  color: #00ada9;
  cursor: pointer;
  margin-left: 5px;
  &:hover {
    color: #00a8a4;
  }
`;
const CategoryDeleteBtn = Styled(BsFillXSquareFill).attrs(() => ({ className: 'red' }))`
  width: 26px;
  height: 26px;
  color: #ee6d6d;
  cursor: pointer;
  margin-left: 5px;
  &:hover {
    color: #ec6565;
  }
`