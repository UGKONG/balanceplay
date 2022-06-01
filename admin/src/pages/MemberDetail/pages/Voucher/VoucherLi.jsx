import React, { useState, useEffect, useMemo } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useDate from '%/useDate';
import useNumber from '%/useNumber';

export default function 보유이용권리스트 ({ data, getList }) {
  const [isInfoView, setIsInfoView] = useState(false);
  const [info, setInfo] = useState({});

  const isFinishVoucher = useMemo(() => {
    let now = new Date(useDate(new Date(), 'date'));
    let target = new Date(data?.REMAIN_DATE);
    let result = target - now >= 0;
    return !result;
  }, [data]);

  const changeVoucherStatus = status => {
    let ask = confirm('이용권을 ' + (status === 1 ? '재개' : '정지') + '처리하시겠습니까?')
    if (!ask) return;

    useAxios.put('/userVoucher/' + data?.ID, { status }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '이용권이 ' + (status === 1 ? '재개' : '정지') + '처리되었습니다.');
      getList();
    })
  }
  const deleteVoucher = () => {

  }
  const changeInfoView = () => {
    if (!isInfoView) return;
    useAxios.get('/voucher/' + data?.VOUCHER_ID).then(({ data }) => {
      if (!data?.result || !data?.data) return setInfo({});
      setInfo(data?.data);
    })
  }

  useEffect(changeInfoView, [isInfoView]);

  return (
    <Wrap className={(!isInfoView && isFinishVoucher) ? 'finish' : ''}>
      {!isInfoView ? (
        <>
          <Head>
            <Status style={{ 
              color: isFinishVoucher ? '#666' : data?.STATUS === 1 ? '#00ada9' : '#ee6d6d'
            }}>
              {isFinishVoucher ? '만료' : data?.STATUS === 1 ? '이용중' : '정지중'}
            </Status>
            <Row>{data?.CATEGORY_NAME}</Row>
            <Name>{data?.NAME}</Name>
          </Head>
          <Body>
            <Row>유형: {data?.USE_TYPE === 1 ? '횟수' : '기간'}제 이용권</Row>
            {data?.REMAIN_COUNT && <Row>이용권 잔여수: {data?.REMAIN_COUNT}회</Row>}
            {data?.REMAIN_DATE && <Row>이용권 만료일: {data?.REMAIN_DATE}</Row>}
          </Body>
          <ButtonWrap>
            {isFinishVoucher ? (
              <Button>이용권 재구매</Button>
            ) : (
              <Button onClick={() => changeVoucherStatus(data?.STATUS === 1 ? 2 : 1)}>
                이용권 {data?.STATUS === 1 ? '정지' : '재개'}
              </Button>
            )}
            <Button>기간 및 횟수 조정</Button>
            <Button onClick={() => setIsInfoView(true)}>이용권 정보</Button>
            <Button onClick={deleteVoucher}>삭제</Button>
          </ButtonWrap>
        </>
      ) : (
        <>
          <Status>이용권 정보</Status>
          <Row>{info?.CATEGORY_NAME}</Row>
          <Name style={{ marginBottom: 20 }}>{info?.NAME}</Name>
          <Body>
            <Row>유형: {info?.USE_TYPE === 1 ? '횟수' : '기간'}제 이용권</Row>
            {info?.USE_COUNT && <Row>횟수: {info?.USE_COUNT} 회</Row>}
            {info?.USE_DAY && <Row>기간: {info?.USE_DAY} 일</Row>}
            <Row style={{ marginTop: 10, fontSize: 14, fontWeight: 500 }}>금액: {useNumber(info?.PLACE) ?? 0}원</Row>
          </Body>
          <ButtonWrap>
            <Button onClick={() => setIsInfoView(false)}>닫 기</Button>
          </ButtonWrap>
        </>
      )}
    </Wrap>
  )
}

const Wrap = Styled.div`
  padding: 10px;
  flex: 1;
  min-width: 200px;
  max-width: 250px;
  height: 340px;
  box-shadow: 0px 3px 4px #00000020;
  border: 1px solid #c9ebe7;
  border-radius: 5px;
  margin: 5px;
  font-size: 13px;
  color: #333;
  display: flex;
  align-items: flex-start;
  flex-flow: column;
  &.finish {
    background-color: #00000010;
  }
`;
const Head = Styled.section`
  margin-bottom: 10px;
  height: 100px;
  width: 100%;
`;
const Body = Styled.section`
  width: 100%;
  flex: 1;
`;
const Status = Styled.p`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 20px;
  width: 100%;
`;
const Name = Styled.p`
  font-size: 16px;
  font-weight: 500;
  width: 100%;
`;
const Row = Styled.div`
  font-size: 12px;
  margin-bottom: 4px;
  width: 100%;
`;
const ButtonWrap = Styled.div`
  padding-top: 10px;
  flex-flow: column;
  width: 100%;
`;
const Button = Styled.button`
  width: 100%;
  margin-bottom: 5px;
  height: 28px;
  line-height: 26px;
  font-size: 12px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;