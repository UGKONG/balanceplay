import React, { useContext, useRef, useState } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useStore from '%/useStore';
import useDate from '%/useDate';
import { Store } from './Scheduler';

export default function 스케줄예약모달({ data, setIsReservationModal }) {
  const close = () => setIsReservationModal(null);

  const submit = () => {};

  const validate = () => {
    submit();
  };

  return (
    <All>
      <Background onClick={close} />
      <Container>
        <HeaderTitle>수업 예약</HeaderTitle>
        <Contents>
          <Row>
            {JSON.stringify(data)}
            {/* <Label>일정 종료 시간</Label>
            <TimeData value={data?.END_TIME ?? '-'} onChange={endTimeChange} /> */}
          </Row>
          <SettingNoticeMsg>
            ※ 해당 스케줄은 반복 생성된 스케줄입니다.
          </SettingNoticeMsg>
        </Contents>
        <Row style={{ marginBottom: 0 }}>
          <Submit onClick={validate}>저장</Submit>
          <Cancel onClick={close}>취소</Cancel>
        </Row>
      </Container>
    </All>
  );
}

const All = Styled.div``;
const Background = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000040;
  z-index: 50000;
`;
const Container = Styled.div`
  position: fixed;
  flex-direction: column;
  align-items: flex-start !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px 16px 16px;
  border-radius: 6px;
  box-shadow: 2px 3px 5px #00000060;
  z-index: 50001;
  min-width: 310px;
  max-width: 400px;
  width: 28%;
  background-color: #fefefe;
  border: 2px solid ${(x) => (x?.border ? x?.border + 'aa' : 'transparent')};
`;
const HeaderTitle = Styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  color: #069f9c;
  padding: 5px 0;
  margin-bottom: 20px;
  position: relative;
`;
const Contents = Styled.section`
  width: 100%;
  max-height: 710px;
  overflow: auto;
`;
const Row = Styled.div`
  width: 100%;
  height: auto;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
  & > * {
    flex: 1;
    margin: 0 5px 10px;
  }
`;
const Label = Styled.span`
  font-size: 13px;
  color: #3ea2a0;
  font-weight: 500;
  letter-spacing: 1px;
  max-width: 100px;
  & + * {
    max-width: calc(100% - 80px);
  }
`;
const Select = Styled.select`
  min-width: 100px;
  height: 34px !important;
`;
const NumberInput = Styled.input.attrs(() => ({
  type: 'number',
  placeholder: '분 단위',
}))`
  width: 100%;
  height: 34px !important;
  &:focus + span {
    color: #222;
  }
`;
const TextInput = Styled.input.attrs(() => ({
  type: 'text',
  placeholder: '선택입력',
}))`
  width: 100%;
  height: 34px !important;
`;
const DateData = Styled.input.attrs(() => ({
  type: 'date',
}))`
  height: 34px !important;
`;
const TimeData = Styled.input.attrs(() => ({
  type: 'time',
}))`
  min-width: calc(50% - 10px);
  height: 34px !important;
`;
const Btn = Styled.button`
  margin-bottom: 0 !important;
`;
const Submit = Styled(Btn)``;
const Cancel = Styled(Btn)`
  background-color: #999;
  border: 1px solid #888;
  &:hover {
    background-color: #888 !important;
  }
  &:focus {
    box-shadow: 0 0 0 4px #77777740 !important;
  }
  &:active {
    background-color: #777 !important;
  }
`;
const SettingNoticeMsg = Styled(Row)`
  margin: 0 5px 20px;
  font-size: 12px;
  color: #666;
`;
