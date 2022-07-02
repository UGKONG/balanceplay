import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import Checkbox from '%/Checkbox';
import useStore from '%/useStore';

export default function 리스트필터 ({ getList, setList, isReset }) {
  const dispatch = useStore(x => x.setState);
  const [isOpen, setIsOpen] = useState(false);

  const [isCountVoucher, setIsCountVoucher] = useState(false);
  const [isDayVoucher, setIsDayVoucher] = useState(false);

  const reset = () => {
    dispatch('temp', null);
    setIsOpen(false);
    setIsCountVoucher(false);
    setIsDayVoucher(false);
  }
  const onChange = () => {
    let filtering = isCountVoucher || isDayVoucher;
    dispatch('temp', filtering);
    getList(null, (list) => {
      let arr = list;
      
      if (isCountVoucher) arr = arr?.map(item => ({ ...item, VOUCHER: item?.VOUCHER?.filter(x => x?.USE_TYPE === 1) }));
      if (isDayVoucher) arr = arr?.map(item => ({ ...item, VOUCHER: item?.VOUCHER?.filter(x => x?.USE_TYPE === 2) }));

      setList(arr);
    })
  };
  const countVoucherChange = () => isCountVoucher && setIsDayVoucher(false);
  const dayVoucherChange = () => isDayVoucher && setIsCountVoucher(false);

  useEffect(onChange, [isCountVoucher, isDayVoucher]);
  useEffect(countVoucherChange, [isCountVoucher]);
  useEffect(dayVoucherChange, [isDayVoucher]);
  useEffect(reset, [isReset]);


  return (
    <Wrap>
      <FilterBtn onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? '닫기' : '필터'}
      </FilterBtn>
      {isOpen && (
        <FilterWrap>
          <Row>
            <RowTitle checked={isCountVoucher}>횟수제 이용권</RowTitle>
            <Checkbox checked={isCountVoucher} onChange={e => setIsCountVoucher(e)} />
          </Row>
          <Row>
            <RowTitle checked={isDayVoucher}>기간제 이용권</RowTitle>
            <Checkbox checked={isDayVoucher} onChange={e => setIsDayVoucher(e)} />
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