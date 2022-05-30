import React, { useState, useEffect, useRef, useMemo } from 'react';
import Styled from 'styled-components';
import Checkbox from '%/Checkbox';
import useDate from '%/useDate';
import useStore from '%/useStore';

export default function 리스트필터 ({ getList, setList, isReset }) {
  const dispatch = useStore(x => x.setState);
  const [isOpen, setIsOpen] = useState(false);
  const [isSalary, setIsSalary] = useState(false);
  const [isUtility, setIsUtility] = useState(false);
  const [isVoucherSell, setIsVoucherSell] = useState(false);
  const [isClass, setIsClass] = useState(false);
  const [isOther, setIsOther] = useState(false);

  const reset = () => {
    dispatch('temp', null);
    setIsOpen(false);
    setIsSalary(false);
    setIsUtility(false);
    setIsVoucherSell(false);
    setIsClass(false);
    setIsOther(false);
  }
  const onChange = () => {
    let filtering = isSalary || isOther || isUtility || isVoucherSell || isClass;
    dispatch('temp', filtering);
    
    getList(null, (list) => {
      let fiveDate = new Date(useDate(new Date(), 'date'));
      let nowTime = fiveDate.getTime();
          fiveDate.setDate(fiveDate.getDate() + 5);
      let fiveTime = fiveDate.getTime();
      let arr = list;
      if (isSalary) arr = arr?.filter(x => x?.CATEGORY === 1);
      if (isUtility) arr = arr?.filter(x => x?.CATEGORY === 2);
      if (isVoucherSell) arr = arr?.filter(x => x?.CATEGORY === 3);
      if (isClass) arr = arr?.filter(x => x?.CATEGORY === 4);
      if (isOther) arr = arr?.filter(x => x?.CATEGORY === 0);

      setList(arr);
    })
  };

  const salaryChange = () => {
    if (isSalary) {
      setIsUtility(false);
      setIsVoucherSell(false);
      setIsClass(false);
      setIsOther(false);
    }
  }
  const utilityChange = () => {
    if (isUtility) {
      setIsSalary(false);
      setIsVoucherSell(false);
      setIsClass(false);
      setIsOther(false);
    }
  }
  const voucherChange = () => {
    if (isVoucherSell) {
      setIsSalary(false);
      setIsUtility(false);
      setIsClass(false);
      setIsOther(false);
    }
  }
  const classChange = () => {
    if (isClass) {
      setIsSalary(false);
      setIsUtility(false);
      setIsVoucherSell(false);
      setIsOther(false);
    }
  }
  const otherChange = () => {
    if (isOther) {
      setIsSalary(false);
      setIsUtility(false);
      setIsVoucherSell(false);
      setIsClass(false);
    }
  }


  useEffect(onChange, [isSalary, isUtility, isVoucherSell, isClass, isOther]);
  useEffect(salaryChange, [isSalary]);
  useEffect(utilityChange, [isUtility]);
  useEffect(voucherChange, [isVoucherSell]);
  useEffect(classChange, [isClass]);
  useEffect(otherChange, [isOther]);
  useEffect(reset, [isReset]);


  return (
    <Wrap>
      <FilterBtn onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? '닫기' : '필터'}
      </FilterBtn>
      {isOpen && (
        <FilterWrap>
          <Row>
            <RowTitle checked={isSalary}>급여</RowTitle>
            <Checkbox checked={isSalary} onChange={e => setIsSalary(e)} />
          </Row>
          <Row>
            <RowTitle checked={isUtility}>공과금</RowTitle>
            <Checkbox checked={isUtility} onChange={e => setIsUtility(e)} />
          </Row>
          <Row>
            <RowTitle checked={isVoucherSell}>이용권 판매</RowTitle>
            <Checkbox checked={isVoucherSell} onChange={e => setIsVoucherSell(e)} />
          </Row>
          <Row>
            <RowTitle checked={isClass}>수업</RowTitle>
            <Checkbox checked={isClass} onChange={e => setIsClass(e)} />
          </Row>
          <Row>
            <RowTitle checked={isOther}>기타</RowTitle>
            <Checkbox checked={isOther} onChange={e => setIsOther(e)} />
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