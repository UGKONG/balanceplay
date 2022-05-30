import React, { useState, useEffect, useRef, useMemo } from 'react';
import Styled from 'styled-components';
import Checkbox from '%/Checkbox';
import useDate from '%/useDate';
import useStore from '%/useStore';

export default function 리스트필터 ({ getList, setList, isReset }) {
  const dispatch = useStore(x => x.setState);
  const [isOpen, setIsOpen] = useState(false);
  const [newMember, setNewMember] = useState(false);
  const [isVoucher, setIsVoucher] = useState(false);
  const [isMale, setIsMale] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [isTestImpossible, setIsTestImpossible] = useState(false);
  const [isFiveUnderDate, setIsFiveUnderDate] = useState(false);
  const [isThreeUnderCount, setIsThreeUnderCount] = useState(false);


  const reset = () => {
    dispatch('temp', null);
    setIsOpen(false);
    setNewMember(false);
    setIsVoucher(false);
    setIsMale(false);
    setIsFemale(false);
    setIsTestImpossible(false);
    setIsFiveUnderDate(false);
    setIsThreeUnderCount(false);
  }
  const onChange = () => {
    let filtering = newMember || isVoucher || isMale || isFemale || isTestImpossible || isFiveUnderDate || isThreeUnderCount;
    dispatch('temp', filtering);
    
    getList(null, (list) => {
      let fiveDate = new Date(useDate(new Date(), 'date'));
      let nowTime = fiveDate.getTime();
          fiveDate.setDate(fiveDate.getDate() + 5);
      let fiveTime = fiveDate.getTime();
      let arr = list;
      if (newMember) arr = arr?.filter(x => {
        let date = new Date(x?.DATE?.split(' ')[0]);
        let now = new Date();
            now.setDate(now.getDate() - 30);
            now = new Date(useDate(now, 'date'));
        return date.getTime() >= now.getTime();
      });
      if (isMale) arr = arr?.filter(x => x?.GENDER === 'M');
      if (isFemale) arr = arr?.filter(x => x?.GENDER === 'F');
      if (isTestImpossible) arr = arr?.filter(x => x?.TEST_FLAG === 0);
      if (isVoucher) arr = arr?.filter(x => x?.VOUCHER?.length > 0);
      if (isFiveUnderDate) arr = arr?.filter(user => {
        let isTrue = false;
        user?.VOUCHER?.forEach(x => {
          let targetDate = new Date(x?.REMAIN_DATE);
          let targetTime = targetDate.getTime();
          let calc = fiveTime - targetTime;
          if (nowTime <= targetTime && calc >= 0) return isTrue = true;
        });
        return isTrue;
      });
      if (isThreeUnderCount) arr = arr?.filter(user => {
        let isTrue = false;
        user?.VOUCHER?.forEach(x => {
          let remainCount = x?.REMAIN_COUNT;
          let targetDate = new Date(x?.REMAIN_DATE);
          let targetTime = targetDate.getTime();
          if (
            nowTime <= targetTime && 
            remainCount > 0 && remainCount <= 3
          ) return isTrue = true;
        });
        return isTrue;
      });

      setList(arr);
    })
  };
  const maleChange = () => isMale && setIsFemale(false);
  const femaleChange = () => isFemale && setIsMale(false);

  useEffect(onChange, [newMember, isVoucher, isMale, isFemale, isTestImpossible, isFiveUnderDate, isThreeUnderCount]);
  useEffect(maleChange, [isMale]);
  useEffect(femaleChange, [isFemale]);
  useEffect(reset, [isReset]);


  return (
    <Wrap>
      <FilterBtn onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? '닫기' : '필터'}
      </FilterBtn>
      {isOpen && (
        <FilterWrap>
          <Row>
            <RowTitle checked={newMember}>신규회원 (1달)</RowTitle>
            <Checkbox checked={newMember} onChange={e => setNewMember(e)} />
          </Row>
          <Row>
            <RowTitle checked={isMale}>남성 회원</RowTitle>
            <Checkbox checked={isMale} onChange={e => setIsMale(e)} />
          </Row>
          <Row>
            <RowTitle checked={isFemale}>여성 회원</RowTitle>
            <Checkbox checked={isFemale} onChange={e => setIsFemale(e)} />
          </Row>
          <Row>
            <RowTitle checked={isTestImpossible}>테스트 비허가</RowTitle>
            <Checkbox checked={isTestImpossible} onChange={e => setIsTestImpossible(e)} />
          </Row>
          <Row>
            <RowTitle checked={isVoucher}>이용권 보유</RowTitle>
            <Checkbox checked={isVoucher} onChange={e => setIsVoucher(e)} />
          </Row>
          <Row>
            <RowTitle checked={isFiveUnderDate}>이용권 5일 이하</RowTitle>
            <Checkbox checked={isFiveUnderDate} onChange={e => setIsFiveUnderDate(e)} />
          </Row>
          <Row>
            <RowTitle checked={isThreeUnderCount}>이용권 3회 이하</RowTitle>
            <Checkbox checked={isThreeUnderCount} onChange={e => setIsThreeUnderCount(e)} />
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
  min-height: 150px;
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