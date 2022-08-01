import React, { useEffect, useMemo, useRef, useState } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function 스케줄_탭아이템_수정모달({
  getCalendarInit,
  isModifyModal,
  setIsModifyModal,
}) {
  const textInputRef = useRef(null);
  const [data, setData] = useState({ ...isModifyModal?.info });

  const tabName = useMemo(() => {
    let tab = isModifyModal?.tab;
    return tab === 1 ? '캘린더' : '룸';
  }, [isModifyModal?.tab]);

  const close = () => setIsModifyModal(null);

  const submit = () => {
    const url = isModifyModal?.tab === 1 ? '/calendar/' : '/room/';
    useAxios.put(url + data?.ID, { name: data?.NAME }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '저장되었습니다.');
      getCalendarInit();
      close();
    });
  };

  const validate = () => {
    if (!data?.NAME) {
      useAlert.warn('알림', '이름을 입력해주세요.');
      textInputRef?.current?.focus();
      return;
    }
    submit();
  };

  useEffect(() => textInputRef?.current?.focus(), []);

  return (
    <All>
      <Background onClick={close} />
      <Container>
        <HeaderTitle>{tabName} 이름 변경</HeaderTitle>
        <Contents>
          <Row>
            <TextInput
              ref={textInputRef}
              value={data?.NAME}
              onKeyDown={(e) => e?.keyCode === 13 && validate()}
              onChange={(e) =>
                setData((prev) => ({ ...prev, NAME: e?.target?.value }))
              }
            />
          </Row>
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
const TextInput = Styled.input.attrs(() => ({
  type: 'text',
  placeholder: '이름입력',
}))`
  width: 100%;
  height: 34px !important;
  margin: 0 0 10px;
`;
const Btn = Styled.button`
  margin-bottom: 0 !important;
`;
const Submit = Styled(Btn)`
  margin-left: 0;
`;
const Cancel = Styled(Btn)`
  background-color: #999;
  border: 1px solid #888;
  margin-right: 0;
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
