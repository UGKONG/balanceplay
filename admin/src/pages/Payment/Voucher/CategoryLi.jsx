import React from 'react';
import Styled from 'styled-components';
import VoucherLi from './VoucherLi';

export default function 카테고리리스트 ({ data, getList, setVoucherId }) {

  return (
    <Wrap>
      <Header>
        <Title>{data?.NAME}</Title>
      </Header>
      <List>
        {data?.VOUCHER?.length === 0 && <NotLi>해당 카테고리에 이용권이 없습니다.</NotLi>}
        {data?.VOUCHER?.sort((a, b) => a?.ID - b?.ID)?.map(item => (
          <VoucherLi key={item?.ID} data={item} getList={getList} setVoucherId={setVoucherId} />
        ))}
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