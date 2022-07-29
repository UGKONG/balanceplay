import React, { useContext, useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import Loading from '@/pages/Common/Loading';
import { Store } from './Scheduler';

export default function 스케줄예약모달({ data, setIsReservationModal }) {
  const { getSchedule } = useContext(Store);
  const [isLoad, setIsLoad] = useState(true);
  const [memberList, setMemberList] = useState([]);
  const [memberSearchText, setMemberSearchText] = useState('');
  const [searchMemberData, setSearchMemberData] = useState(null);
  const [searchMemberVoucherList, setSearchMemberVoucherList] = useState([]);
  const [searchMemberVoucher, setSearchMemberVoucher] = useState(null);

  const getMemberList = () => {
    let value = memberSearchText?.replaceAll(' ', '');
    useAxios.get('/member?q=' + value).then(({ data }) => {
      setIsLoad(false);
      if (!data?.result || !data?.data) return setMemberList([]);
      setMemberList(data?.data);
    });
  };

  const getMemberVoucherList = () => {
    useAxios
      .get('/userVoucherList/' + searchMemberData?.ID)
      .then(({ data }) => {
        if (!data?.result || !data?.data) {
          return setSearchMemberVoucherList(null);
        }
        let filter = data?.data?.filter((x) => {
          let now = new Date();
          let remainDate = new Date(x?.REMAIN_DATE);
          let remainCount = x?.REMAIN_COUNT;
          if (remainDate - now >= 0 && remainCount > 0) return true;
        });
        setSearchMemberVoucherList(filter);
      });
  };

  const memberClick = (item) => {
    setMemberSearchText(item?.NAME);
    setSearchMemberData(item);
  };

  const voucherListText = useMemo(() => {
    if (!searchMemberData) return '회원을 선택해주세요.';
    if (searchMemberVoucherList?.length === 0) return '이용권이 없습니다.';
    return '이용권을 선택해주세요.';
  }, [searchMemberData, searchMemberVoucherList]);

  const voucherRemainDateCount = useMemo(() => {
    let now = new Date();
    let remain = new Date(searchMemberVoucher?.REMAIN_DATE);
    let calc = Math.round((remain - now) / 1000 / 24 / 60 / 60);
    return calc ?? 0;
  }, [searchMemberVoucher]);

  const close = () => setIsReservationModal(null);

  const submit = (isWait) => {
    let form = {
      SCHEDULE_ID: data?.ID,
      USER_VOUCHER_ID: searchMemberVoucher?.ID,
      IS_WAIT: isWait,
    };
    useAxios.post('/reservation', form).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '예약되었습니다.');
      close();
      getSchedule();
    });
  };

  const validate = () => {
    if (!searchMemberData) {
      return useAlert.warn('알림', '회원을 선택해주세요.');
    }
    if (!searchMemberVoucher) {
      return useAlert.warn('알림', '이용권을 선택해주세요.');
    }
    if (
      data?.RESERVATION_COUNT >= data?.COUNT &&
      data?.RESERVATION_WAIT_COUNT >= data?.WAIT_COUNT
    ) {
      return useAlert.warn('알림', '모든 인원이 마감되었습니다.');
    }
    let isWait = Number(data?.RESERVATION_COUNT) >= Number(data?.COUNT);
    submit(isWait);
  };

  useEffect(getMemberList, [memberSearchText]);
  useEffect(getMemberVoucherList, [searchMemberData]);

  return (
    <All>
      <Background onClick={close} />
      <Container>
        <HeaderTitle>수업 예약</HeaderTitle>
        <Contents>
          <Row>
            <Label>수업</Label>
            <Label>{data?.TITLE}</Label>
          </Row>
          <Row>
            <Label>룸</Label>
            <Label>{data?.ROOM_NAME}</Label>
          </Row>
          <Row>
            <Label>강사</Label>
            <Label>{data?.TEACHER_NAME}</Label>
          </Row>
          <Row>
            <Label>예약 인원</Label>
            <Label>
              {data?.RESERVATION_COUNT ?? 0} / {data?.COUNT ?? 0}명
            </Label>
          </Row>
          <Row>
            <Label>대기 인원</Label>
            <Label>
              {data?.RESERVATION_WAIT_COUNT ?? 0} / {data?.WAIT_COUNT ?? 0}명
            </Label>
          </Row>
          {data?.MEMO && (
            <Row
              style={{
                alignItems: 'flex-start',
                maxHeight: 76,
                overflow: 'auto',
              }}
            >
              <Label>메모</Label>
              <Label>{data?.MEMO}</Label>
            </Row>
          )}
          <Row>
            <Label>회원</Label>
            <TextInput
              value={memberSearchText}
              onChange={(e) => setMemberSearchText(e?.target?.value)}
            />
            <SearchListContainer>
              {isLoad ? (
                <Loading />
              ) : (
                <>
                  {memberList?.map((item) => (
                    <li key={item?.ID} onClick={() => memberClick(item)}>
                      {item?.NAME}
                    </li>
                  ))}
                </>
              )}
            </SearchListContainer>
          </Row>
          <Row>
            <Label>이용권</Label>
            <Select
              value={searchMemberVoucher?.ID}
              onChange={(e) => {
                let value = Number(e?.target?.value);
                let find = searchMemberVoucherList?.find(
                  (x) => x?.ID === value,
                );
                setSearchMemberVoucher(find);
              }}
            >
              <option value={0}>{voucherListText}</option>
              {searchMemberVoucherList?.map((item) => (
                <option key={item?.ID} value={item?.ID}>
                  {item?.NAME}
                </option>
              ))}
            </Select>
          </Row>
          <Row>
            <Label>이용권 정보</Label>
            {searchMemberVoucher ? (
              <Label>
                잔여일: {voucherRemainDateCount}일 / 잔여수:{' '}
                {searchMemberVoucher?.REMAIN_COUNT}회
              </Label>
            ) : (
              <Label style={{ color: '#777' }}>이용권을 선택해주세요.</Label>
            )}
          </Row>
          {/* {JSON.stringify(data)} */}
          {/* <SettingNoticeMsg>
            ※ 해당 스케줄은 반복 생성된 스케줄입니다.
          </SettingNoticeMsg> */}
        </Contents>
        <Row style={{ marginBottom: 0 }}>
          <Submit onClick={validate}>예약</Submit>
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
  position: relative;
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
    color: #444;
  }
`;
const SearchListContainer = Styled.ul`
  max-height: 200px;
  overflow: auto;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 -2px 4px #00000010;
  position: absolute;
  bottom: calc(100% - 5px);
  right: 0;
  width: calc(100% - 120px);
  min-height: 100px;
  border-radius: 3px;
  display: none;
  &:hover {
    display: block !important;
  }
  & > li {
    padding: 4px 10px;
    margin-top: 5px;
    font-size: 13px;
    color: #777;
    background-color: #fff;
    cursor: pointer;
    &:hover {
      color: #555;
      background-color: #eee;
    }
    &:last-of-type {
      margin-bottom: 5px;
    }
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
  placeholder: '회원검색',
}))`
  width: 100%;
  height: 34px !important;
  &:focus {
    & + ul {
      display: block;
    }
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
