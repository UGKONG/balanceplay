import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useStore from '%/useStore';
import useDate from '%/useDate';
import { Store } from './Scheduler';

export default function 스케줄설정모달({ setIsSettingModal }) {
  const navigate = useNavigate();
  const { calendarList, roomList } = useContext(Store);
  const currentSetting = useStore((x) => x?.setting);
  const tabType = useRef([
    { id: 1, name: '캘린더' },
    { id: 2, name: '방' },
    { id: 3, name: '선생님' },
  ]);
  const colorType = useRef([
    { id: 1, name: '룸' },
    { id: 2, name: '강사' },
  ]);
  const viewType = useRef([
    { id: 1, name: '년' },
    { id: 2, name: '월' },
    { id: 3, name: '주' },
    { id: 4, name: '일' },
  ]);
  const [data, setData] = useState({ ...currentSetting });

  const close = () => setIsSettingModal(false);

  const startTimeChange = (e) => {
    let val = e?.target?.value;
    if (val?.length >= 5) val = val?.split(':')[0] + ':00';
    if (Number(val?.split(':')[0]) >= 9) {
      val = '09:00';
      e?.target?.blur();
    }
    setData((prev) => ({ ...prev, START_TIME: val }));
  };
  const endTimeChange = (e) => {
    let val = e?.target?.value;
    if (val?.length >= 5) val = val?.split(':')[0] + ':00';
    if (Number(val?.split(':')[0]) <= 18) {
      val = '18:00';
      e?.target?.blur();
    }
    setData((prev) => ({ ...prev, END_TIME: val }));
  };

  const submit = () => {
    useAxios.put('/setting', data).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '저장되었습니다.');
      close();
      navigate('/schedule');
    });
  };

  const validate = () => {
    if (!data?.ACTIVE_TAB_ID)
      return useAlert?.warn('알림', '탭을 선택해주세요.');
    if (
      data?.ACTIVE_CALENDAR_ID === undefined ||
      data?.ACTIVE_CALENDAR_ID === null
    )
      return useAlert?.warn('알림', '캘린더를 선택해주세요.');
    if (data?.ACTIVE_ROOM_ID === undefined || data?.ACTIVE_ROOM_ID === null)
      return useAlert?.warn('알림', '룸을 선택해주세요.');
    if (!data?.ACTIVE_VIEW_TYPE_ID)
      return useAlert?.warn('알림', '보기를 선택해주세요.');
    if (!data?.SCHEDULE_COLOR_TYPE)
      return useAlert?.warn('알림', '색상기준을 선택해주세요.');
    if (!data?.SCHEDULE_TIME_RANGE)
      return useAlert?.warn('알림', '일정 시간 범위을 분 단위로 입력해주세요.');
    if (!data?.START_TIME || data?.START_TIME?.length < 5)
      return useAlert?.warn('알림', '일정 시작 시간을 정확히 입력해주세요.');
    if (!data?.END_TIME || data?.END_TIME?.length < 5)
      return useAlert?.warn('알림', '일정 종료 시간을 정확히 입력해주세요.');

    let start = new Date(useDate(undefined, 'date') + ' ' + data?.START_TIME);
    let end = new Date(useDate(undefined, 'date') + ' ' + data?.END_TIME);
    if (end - start <= 0)
      return useAlert?.warn('알림', '일정 종료 시간을 잘못 입력했습니다.');

    submit();
  };

  return (
    <All>
      <Background onClick={close} />
      <Container>
        <HeaderTitle>스케줄 기본 설정</HeaderTitle>
        <Contents>
          <Row>
            <Label>탭</Label>
            <Select
              value={data?.ACTIVE_TAB_ID}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  ACTIVE_TAB_ID: Number(e?.target?.value),
                }))
              }
            >
              {tabType?.current?.map((item) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name}
                </option>
              ))}
            </Select>
          </Row>
          <Row>
            <Label>캘린더</Label>
            <Select
              value={data?.ACTIVE_CALENDAR_ID}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  ACTIVE_CALENDAR_ID: Number(e?.target?.value),
                }))
              }
            >
              <option value={0}>전체</option>
              {calendarList?.map((item) => (
                <option key={item?.ID} value={item?.ID}>
                  {item?.NAME}
                </option>
              ))}
            </Select>
          </Row>
          <Row>
            <Label>룸</Label>
            <Select
              value={data?.ACTIVE_ROOM_ID}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  ACTIVE_ROOM_ID: Number(e?.target?.value),
                }))
              }
            >
              <option value={0}>전체</option>
              {roomList?.map((item) => (
                <option key={item?.ID} value={item?.ID}>
                  {item?.NAME}
                </option>
              ))}
            </Select>
          </Row>
          <Row>
            <Label>보기</Label>
            <Select
              value={data?.ACTIVE_VIEW_TYPE_ID}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  ACTIVE_VIEW_TYPE_ID: Number(e?.target?.value),
                }))
              }
            >
              {viewType?.current?.map((item) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name} 단위
                </option>
              ))}
            </Select>
          </Row>
          <Row>
            <Label>색상 기준</Label>
            <Select
              value={data?.SCHEDULE_COLOR_TYPE}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  SCHEDULE_COLOR_TYPE: Number(e?.target?.value),
                }))
              }
            >
              {colorType?.current?.map((item) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name} 별 다른 색
                </option>
              ))}
            </Select>
          </Row>
          <Row>
            <Label>일정 시간 범위</Label>
            <NumberInput
              value={data?.SCHEDULE_TIME_RANGE}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  SCHEDULE_TIME_RANGE: Number(e?.target?.value),
                }))
              }
            />
          </Row>
          <Row>
            <Label>일정 시작 시간</Label>
            <TimeData
              value={data?.START_TIME ?? '-'}
              onChange={startTimeChange}
            />
          </Row>
          <Row>
            <Label>일정 종료 시간</Label>
            <TimeData value={data?.END_TIME ?? '-'} onChange={endTimeChange} />
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
