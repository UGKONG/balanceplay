import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';

export default function 검사정보박스({ data }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Container isOpen={isOpen}>
      {isOpen && (
        <>
          <Left>
            <Name>{data?.NAME ?? '-'}</Name>
            <Method>{data?.METHOD_NAME ?? '-'}</Method>
          </Left>
          <Right>
            {data?.DESCRIPTION?.map(item => (
              <CategoryItem key={item?.ID}>
                <b>{item?.NAME}</b>
                <span dangerouslySetInnerHTML={{ __html: item?.DESCRIPTION }} />
              </CategoryItem>
            ))}
          </Right>
        </>
      )}
      <OpenBtn onClick={() => setIsOpen(!isOpen)}>
        검사정보 {isOpen ? '닫기' : '열기'}
      </OpenBtn>
    </Container>
  )
}

const Container = Styled.div`
  border-radius: 8px;
  width: 100%;
  min-height: ${x => x?.isOpen ? 200 : 40}px;
  max-height: 200px;
  padding: 16px 16px 10px;
  margin-bottom: 10px;
  background-color: #b9e1dcaa;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start !important;
  position: relative;
  overflow: hidden;

  & > section {
    min-width: 200px;
    height: calc(100% - 40px);
  }
`;
const Left = Styled.section`
  padding-right: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  border-right: 1px solid #fff;
`;
const Right = Styled.section`
  width: calc(100% - 200px);
  overflow: auto;
  padding: 0 10px 0 30px;
`;
const Name = Styled.p`
  font-size: 18px;
  font-weight: 700;
  color: #209b98;
`;
const Method = Styled.p`
  font-size: 14px;
  color: #e34949;
`;
const CategoryItem = Styled.article`
  margin-bottom: 16px;
  &:last-of-type {
    margin-bottom: 0;
  }
  & > b {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    color: #00ac99;
  }
  & > span {
    font-size: 13px;
    color: #999;
  }
`;
const OpenBtn = Styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  font-size: 13px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #a8d7d2;
  &:hover {
    background-color: #92c7c2;
    color: #fff;
  }
`