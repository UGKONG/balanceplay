import React, { useState, useEffect, useRef, useMemo } from 'react';
import Styled from 'styled-components';
import Checkbox from '%/Checkbox';
import useDate from '%/useDate';
import useStore from '%/useStore';

export default function 리스트필터 ({ getList, setList, isReset }) {
  const dispatch = useStore(x => x.setState);
  const [isOpen, setIsOpen] = useState(false);
  const [isCenterNotice, setIsCenterNotice] = useState(false);
  const [isTeacherNotice, setIsTeacherNotice] = useState(false);
  const [isMemberNotice, setIsMemberNotice] = useState(false);

  const reset = () => {
    dispatch('temp', null);
    setIsOpen(false);
    setIsCenterNotice(false);
    setIsTeacherNotice(false);
    setIsMemberNotice(false);
  }
  const onChange = () => {
    let filtering = isCenterNotice || isTeacherNotice || isMemberNotice;
    dispatch('temp', filtering);
    
    getList(null, (list) => {
      let arr = list;
      if (isCenterNotice) arr = arr?.filter(x => x?.TYPE === 0);
      if (isTeacherNotice) arr = arr?.filter(x => x?.TYPE === 1);
      if (isMemberNotice) arr = arr?.filter(x => x?.TYPE === 2);

      setList(arr);
    })
  };

  const centerChange = () => {
    if (isCenterNotice) {
      setIsTeacherNotice(false);
      setIsMemberNotice(false);
    }
  }
  const TeacherChange = () => {
    if (isTeacherNotice) {
      setIsCenterNotice(false);
      setIsMemberNotice(false);
    }
  }
  const MemberChange = () => {
    if (isMemberNotice) {
      setIsCenterNotice(false);
      setIsTeacherNotice(false);
    }
  }

  useEffect(onChange, [isCenterNotice, isTeacherNotice, isMemberNotice]);
  useEffect(centerChange, [isCenterNotice]);
  useEffect(TeacherChange, [isTeacherNotice]);
  useEffect(MemberChange, [isMemberNotice]);
  useEffect(reset, [isReset]);


  return (
    <Wrap>
      <FilterBtn onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? '닫기' : '필터'}
      </FilterBtn>
      {isOpen && (
        <FilterWrap>
          <Row>
            <RowTitle checked={isCenterNotice}>센터 공지</RowTitle>
            <Checkbox checked={isCenterNotice} onChange={e => setIsCenterNotice(e)} />
          </Row>
          <Row>
            <RowTitle checked={isTeacherNotice}>직원 공지</RowTitle>
            <Checkbox checked={isTeacherNotice} onChange={e => setIsTeacherNotice(e)} />
          </Row>
          <Row>
            <RowTitle checked={isMemberNotice}>회원 공지</RowTitle>
            <Checkbox checked={isMemberNotice} onChange={e => setIsMemberNotice(e)} />
          </Row>
        </FilterWrap>
      )}
    </Wrap>
  )
}

const Wrap = Styled.section`
  position: relative;
  @media screen and (max-width: 500px) {
    position: unset;
  }
`;
const FilterBtn = Styled.button`
  margin-left: 10px;
  position: relative;
  transition: .2s;
`;
const FilterWrap = Styled.div`
  position: absolute;
  width: 20vw;
  min-width: 200px;
  max-width: 250px;
  top: calc(100% + 5px);
  left: 10px;
  z-index: 3;
  align-items: flex-start !important;
  background-color: #fff;
  border: 1px solid #00ada9;
  border-radius: 3px;
  flex-flow: column;
  padding: 5px 0;
  @media screen and (max-width: 500px) {
    min-width: calc(100vw - 80px);
    top: calc(100% - 20px);
    left: 0;
  }
`;
const Row = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 5px 10px;
  font-size: 14px;
`;
const RowTitle = Styled.p`
  flex: 1;
  color: ${x => x.checked ? '#333' : '#888'};
  transition: .2s;
`;