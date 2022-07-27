import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useDate from '%/useDate';
import useAlert from '%/useAlert';
import { Store } from './Scheduler';
import { BsCheck } from 'react-icons/bs';

export default function 스케줄작성() {
  const dayList = useRef([
    { id: 0, ko: '일', en: 'SUN' },
    { id: 1, ko: '월', en: 'MON' },
    { id: 2, ko: '화', en: 'TUE' },
    { id: 3, ko: '수', en: 'WED' },
    { id: 4, ko: '목', en: 'THU' },
    { id: 5, ko: '금', en: 'FRI' },
    { id: 6, ko: '토', en: 'SAT' },
  ]);
  const typeList = useRef([
    { id: 1, name: '개인래슨' },
    { id: 2, name: '그룹래슨' },
  ]);
  const {
    list,
    active,
    colorList,
    writeInfo,
    setWriteInfo,
    roomList,
    calendarList,
    getSchedule,
  } = useContext(Store);
  const [data, setData] = useState({
    ...writeInfo,
    TYPE: writeInfo?.TYPE ?? typeList?.current[0]?.id,
    SUN: false,
    MON: false,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false,
    SAT: false,
  });
  const [teacherList, setTeacherList] = useState([]);
  const [isFullDay, setIsFullDay] = useState(false);

  const scheduleStatus = useMemo(() => (writeInfo?.ID ? 1 : 0), [writeInfo]);

  const border = useMemo(() => {
    if (!data?.ROOM_ID) return null;
    let idx = roomList?.findIndex((x) => x?.ID === Number(data?.ROOM_ID));
    return colorList[idx];
  }, [roomList, data]);

  const today = useMemo(() => {
    return useDate(new Date(), 'date');
  });

  const getTeacherList = () => {
    useAxios.get('/teacher').then(({ data }) => {
      if (!data?.result || !data?.data) return setTeacherList([]);
      setTeacherList(data?.data);
    });
  };

  const close = () => setWriteInfo(null);

  const dayChecked = (checked, en) => {
    let copy = { ...data };
    copy[en] = checked;
    setData(copy);
  };

  const validate = () => {
    let ID = data?.ID;
    let TYPE = data?.TYPE;
    let TITLE = data?.TITLE;
    let START_DATE = data?.START_DATE;
    let END_DATE = data?.END_DATE;
    let START_TIME = data?.START_TIME;
    let END_TIME = data?.END_TIME;
    let CALENDAR_ID = Number(data?.CALENDAR_ID);
    let ROOM_ID = Number(data?.ROOM_ID);
    let TEACHER_ID = Number(data?.TEACHER_ID);
    let SUN = data?.SUN;
    let MON = data?.MON;
    let TUE = data?.TUE;
    let WED = data?.WED;
    let THU = data?.THU;
    let FRI = data?.FRI;
    let SAT = data?.SAT;
    let COUNT = TYPE === 1 ? 1 : Number(data?.COUNT || 0);
    let WAIT_COUNT = TYPE === 1 ? 0 : Number(data?.WAIT_COUNT || 0);
    let MEMO = data?.MEMO ?? '';

    if (data?.CALENDAR_TYPE !== 1) {
      ROOM_ID = 0;
      TEACHER_ID = 0;
    }

    if (!TITLE?.trim()) {
      return useAlert?.warn('알림', '스케줄 제목을 정확히 선택해주세요.');
    }
    if (!START_DATE || START_DATE?.length !== 10) {
      return useAlert?.warn('알림', '시작 날짜를 정확히 선택해주세요.');
    }
    if (SUN || MON || TUE || WED || THU || FRI || SAT) {
      let startDate = new Date(START_DATE);
      let endDate = new Date(END_DATE);
      let calc = Math.round((endDate - startDate) / 1000 / 24 / 60 / 60);
      if (calc === 0)
        return useAlert.warn(
          '알림',
          '반복은 시작일과 종료일을 다르게 할 수 없습니다.',
        );
    }
    if (!END_DATE || END_DATE?.length !== 10) {
      return useAlert?.warn('알림', '종료 날짜를 정확히 선택해주세요.');
    }
    if (!START_TIME || START_TIME?.length !== 8) {
      return useAlert?.warn('알림', '시작 시간을 정확히 선택해주세요.');
    }
    if (!END_TIME || END_TIME?.length !== 8) {
      return useAlert?.warn('알림', '종료 시간을 정확히 선택해주세요.');
    }
    if (!CALENDAR_ID) {
      return useAlert?.warn('알림', '캘린더를 선택해주세요.');
    }
    if (!ROOM_ID && data?.CALENDAR_TYPE === 1) {
      return useAlert?.warn('알림', '룸을 선택해주세요.');
    }
    if (!TEACHER_ID && data?.CALENDAR_TYPE === 1) {
      return useAlert?.warn('알림', '강사를 선택해주세요.');
    }
    if (!COUNT && data?.CALENDAR_TYPE === 1) {
      return useAlert?.warn('알림', '예약 인원은 최소 1명 이상이여야 합니다.');
    }

    (scheduleStatus === 0 ? postSubmit : putSubmit)({
      ID,
      TYPE,
      TITLE,
      START_DATE,
      END_DATE,
      START_TIME,
      END_TIME,
      CALENDAR_ID,
      ROOM_ID,
      TEACHER_ID,
      SUN,
      MON,
      TUE,
      WED,
      THU,
      FRI,
      SAT,
      MEMO,
      COUNT,
      WAIT_COUNT,
    });
  };

  const postSubmit = (send) => {
    useAxios.post('/schedule', send).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '스케줄이 생성되었습니다.');
      close();
      getSchedule();
    });
  };

  const putSubmit = (send) => {
    useAxios.put('/schedule/' + send?.ID, send).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '스케줄이 수정되었습니다.');
      close();
      getSchedule();
    });
  };

  const fullDayChange = (e) => {
    setData((prev) => ({
      ...prev,
      START_TIME: '00:00:00',
      END_TIME: '23:59:00',
    }));
    setIsFullDay(e?.target?.checked);
  };

  useEffect(() => {
    getTeacherList();
    return () => getTeacherList;
  }, []);

  useEffect(() => {
    if (!data) return;
    if (scheduleStatus === 0 && !data?.CALENDAR_TYPE) return close();
  }, [data]);

  return (
    <All>
      <Background onClick={close} />
      <Container border={border}>
        <HeaderTitle>
          <span>스케줄 {scheduleStatus === 1 ? '수정' : '생성'}</span>
          <TypeContainer>
            <TypeWrap
              style={{
                width:
                  scheduleStatus === 1 || data?.CALENDAR_TYPE === 2 ? 75 : 150,
              }}
            >
              <TypeBackground
                type={data?.TYPE}
                isModify={scheduleStatus === 1 || data?.CALENDAR_TYPE === 2}
                style={{
                  width:
                    scheduleStatus === 1 || data?.CALENDAR_TYPE === 2
                      ? '100%'
                      : '50%',
                }}
              />
              {data?.CALENDAR_TYPE === 1 ? (
                typeList?.current?.map((item) => (
                  <TypeItem
                    key={item?.id}
                    type={data?.TYPE}
                    id={item?.id}
                    style={{
                      display: !scheduleStatus
                        ? 'flex'
                        : data?.TYPE === item?.id
                        ? 'flex'
                        : 'none',
                    }}
                    onClick={() =>
                      setData((prev) => ({ ...prev, TYPE: item?.id }))
                    }
                  >
                    {item?.name}
                  </TypeItem>
                ))
              ) : (
                <TypeItem type={data?.TYPE} style={{ color: '#fff' }}>
                  일반
                </TypeItem>
              )}
            </TypeWrap>
          </TypeContainer>
        </HeaderTitle>
        <Contents>
          <Title
            value={data?.TITLE ?? ''}
            onChange={(e) =>
              setData((prev) => ({ ...prev, TITLE: e.target.value }))
            }
          />
          <Row>
            <Label>시 작</Label>
            <Label>종 료</Label>
          </Row>
          <Row>
            <DateData
              value={data?.START_DATE ?? today}
              disabled={scheduleStatus === 1}
              onChange={(e) =>
                setData((prev) => ({ ...prev, START_DATE: e?.target?.value }))
              }
            />
            <DateData
              value={data?.END_DATE ?? today}
              disabled={scheduleStatus === 1}
              onChange={(e) =>
                setData((prev) => ({ ...prev, END_DATE: e?.target?.value }))
              }
            />
          </Row>
          {!isFullDay && (
            <Row>
              <TimeData
                value={data?.START_TIME}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    START_TIME: e?.target?.value + ':00',
                  }))
                }
              />
              <TimeData
                value={data?.END_TIME}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    END_TIME: e?.target?.value + ':00',
                  }))
                }
              />
            </Row>
          )}
          <Row style={{ marginBottom: 20 }}>
            {scheduleStatus === 0 && (
              <FullDayCheckbox>
                <input
                  type="checkbox"
                  id="fullDay"
                  checked={isFullDay}
                  onChange={fullDayChange}
                />
                <label htmlFor="fullDay" className="checkbox">
                  <CheckIcon />
                </label>
                <label htmlFor="fullDay" className="label">
                  종일 일정
                </label>
              </FullDayCheckbox>
            )}
          </Row>
          <Row>
            <Label>캘린더</Label>
          </Row>
          <Row>
            <Select
              disabled
              value={
                scheduleStatus === 0 ? active?.calendar : data?.CALENDAR_ID
              }
            >
              <option value="0">캘린더 선택</option>
              {calendarList?.map((item) => (
                <option key={item?.ID} value={item?.ID}>
                  {item?.NAME}
                </option>
              ))}
            </Select>
          </Row>
          {data?.CALENDAR_TYPE === 1 && (
            <>
              <Row>
                <Label>룸</Label>
                <Label>강 사</Label>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Select
                  value={data?.ROOM_ID ?? 0}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, ROOM_ID: e?.target?.value }))
                  }
                >
                  <option value="0">룸 선택</option>
                  {roomList?.map((item) => (
                    <option key={item?.ID} value={item?.ID}>
                      {item?.NAME}
                    </option>
                  ))}
                </Select>
                <Select
                  value={data?.TEACHER_ID ?? 0}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      TEACHER_ID: e?.target?.value,
                    }))
                  }
                >
                  <option value="0">강사 선택</option>
                  {teacherList?.map((item) => (
                    <option key={item?.ID} value={item?.ID}>
                      {item?.NAME}
                    </option>
                  ))}
                </Select>
              </Row>
            </>
          )}
          {scheduleStatus === 0 && (
            <>
              <Row>
                <Label>반 복</Label>
              </Row>
              <Row>
                <DayList>
                  {dayList?.current?.map((item) => (
                    <DayItem key={item?.id}>
                      <DayItemInput
                        id={'day' + item?.id}
                        checked={data[item?.en]}
                        onChange={(e) =>
                          dayChecked(e?.target?.checked, item?.en)
                        }
                      />
                      <DayItemLabel htmlFor={'day' + item?.id}>
                        {item?.ko}
                      </DayItemLabel>
                    </DayItem>
                  ))}
                </DayList>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Label style={{ fontSize: 12, color: '#f05a5a' }}>
                  반복 요일이 지정되어도 시작일 이후 부터 적용됩니다.
                </Label>
              </Row>
            </>
          )}
          {data?.TYPE === 2 && (
            <Row>
              <Label>예약 인원</Label>
              <Label>대기 인원</Label>
            </Row>
          )}
          {data?.TYPE === 2 && (
            <Row style={{ marginBottom: 20 }}>
              <NumberInputContainer>
                <NumberInput
                  value={data?.COUNT ?? ''}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, COUNT: e.target.value }))
                  }
                />
                <span>명</span>
              </NumberInputContainer>
              <NumberInputContainer>
                <NumberInput
                  value={data?.WAIT_COUNT ?? ''}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, WAIT_COUNT: e.target.value }))
                  }
                />
                <span>명</span>
              </NumberInputContainer>
            </Row>
          )}
          <Row>
            <Label>메 모</Label>
          </Row>
          <Row>
            <TextInput
              value={data?.MEMO ?? ''}
              onChange={(e) =>
                setData((prev) => ({ ...prev, MEMO: e.target.value }))
              }
            />
          </Row>
          <Row
            style={{
              marginBottom: 20,
              marginLeft: 5,
              marginRight: 5,
              fontSize: 12,
              color: '#666',
            }}
          >
            {data?.IS_REPEAT ? '※ 해당 스케줄은 반복 생성된 스케줄입니다.' : ''}
          </Row>
        </Contents>
        <Row>
          <Submit onClick={validate}>
            {scheduleStatus === 1 ? '수정' : '생성'}
          </Submit>
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
  margin-bottom: 10px;
  position: relative;
`;
const TypeContainer = Styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;
const TypeWrap = Styled.div`
  position: relative;
  display: flex;
  width: 150px;
`;
const TypeItem = Styled.p`
  flex: 1;
  z-index: 2;
  height: 34px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(x) => (x?.type === x?.id ? '#fff' : '#888')};
  &:hover {
    color: ${(x) => (x?.type === x?.id ? '#fff' : '#666')};
  }
`;
const TypeBackground = Styled.p`
  width: 50%;
  height: 100%;
  border-radius: 100px;
  background-color: #069f9c;
  position: absolute;
  top: 0;
  left: ${(x) => (x?.isModify ? 0 : x?.type === 1 ? 0 : 50)}%;
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
  transition: height .3s;
  & > * {
    flex: 1;
    margin: 0 5px 10px;
  }
`;
const Label = Styled.span`
  font-size: 13px;
  color: #3ea2a0;
  font-weight: 500;
  text-align: center;
  letter-spacing: 1px;
`;
const Title = Styled.input.attrs(() => ({
  type: 'text',
  placeholder: '스케줄 제목',
}))`
  display: block;
  width: 100%;
  height: 40px !important;
  font-size: 20px !important;
  transition: .1s;
  color: #555;
  margin-bottom: 20px;
  padding: 0 2px !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  border-radius: 0 !important;
  border-color: transparent !important;
  &:hover {
    border-color: #ddd !important;
  }
  &:focus {
    color: #000;
    border-color: #ddd !important;
  }
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
  max-width: 50%;
  height: 34px !important;
`;
const FullDayCheckbox = Styled.p`
  display: flex;
  align-items: center;
  & > input {
    display: none;

    &:checked {
      & ~ .label, & + .checkbox > svg {
        color: #069f9c;
      }
    }
  }
  & > label.checkbox {
    width: 20px;
    height: 20px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & > label.label {
    font-size: 14px;
    color: #555;
    margin-left: 5px;
    cursor: pointer;
  }
`;
const CheckIcon = Styled(BsCheck)`
  cursor: pointer;
  color: #888;
  width: 100%;
  height: 100%;
`;
const Select = Styled.select`
  min-width: 100px;
  height: 34px !important;
`;
const NumberInputContainer = Styled.div`
  max-width: calc(50% - 50px);
  margin: 0 25px 10px;
  & > span {
    font-size: 14px;
    color: #777;
    margin-left: 5px;
  }
`;
const NumberInput = Styled.input.attrs(() => ({
  type: 'number',
  placeholder: '인원입력',
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
const DayList = Styled.section`
  display: flex;
  justify-content: center;
`;
const DayItem = Styled.article`
  
`;
const DayItemInput = Styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  display: none;
  &:checked + label {
    font-weight: 900;
    color: #17aba8;
  }
`;
const DayItemLabel = Styled.label`
  width: 36px;
  height: 36px;
  color: #666;
  font-weight: 300;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    color: #444;
  }
`;
const Btn = Styled.button`
  margin-bottom: 0 !important;
`;
const Submit = Styled(Btn)`

`;
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
