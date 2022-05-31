import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useDate from '%/useDate';
import useNumber from '%/useNumber';

export default function 이용권추가 ({ categoryId, getList, setIsCreate }) {
  const [useType, setUseType] = useState([]);
  const [data, setData] = useState({
    USE_TYPE: 1, PLACE: null
  });

  const init = () => {
    useAxios.get('/common/4').then(({ data }) => {
      if (!data?.result || !data?.data) return setUseType([]);
      setUseType(data?.data);
    })
  }
  const validate = () => {
    if (!data?.NAME?.trim()) return useAlert.warn('알림', '이용권 이름을 입력해주세요.');
    if (!data?.USE_COUNT && data?.USE_TYPE === 1) return useAlert.warn('알림', '사용 횟수를 입력해주세요.');
    if (!data?.USE_DAY) return useAlert.warn('알림', '사용 기간을 입력해주세요.');
    if (data?.PLACE === null || data?.PLACE === '') return useAlert.warn('알림', '이용권 금액을 입력해주세요.');

    if (data?.USE_DAY.search(/[a-zA-zㄱ-ㅎ가-힣]/gi) > -1) return useAlert.warn('알림', '사용 기간을 정확히 입력해주세요.');
    if (data?.USE_TYPE === 1 && data?.USE_COUNT.search(/[a-zA-zㄱ-ㅎ가-힣]/gi) > -1) return useAlert.warn('알림', '사용 횟수를 정확히 입력해주세요.');
    if (data?.PLACE.search(/[a-zA-zㄱ-ㅎ가-힣]/gi) > -1) return useAlert.warn('알림', '이용권 금액을 정확히 입력해주세요.');

    let send = {
      CATEGORY_ID: categoryId,
      NAME: data?.NAME,
      PLACE: Number(data?.PLACE?.replaceAll(',', '')),
      USE_TYPE: Number(data?.USE_TYPE),
      USE_DAY: Number(data?.USE_DAY),
      USE_COUNT: Number(data?.USE_COUNT),
    }
    submit(send);
  }
  const submit = send => {
    useAxios.post('/voucher', { data: send }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '이용권이 저장되었습니다.');
      getList();
      setIsCreate(false);
    })
  }

  useEffect(init, []);

  return (
    <Wrap>
      <Row>
        <NameInput value={data?.NAME ?? ''} onChange={e => setData(prev => ({...prev, NAME: e.target.value}))} />
      </Row>
      <Body>
        <Row style={{ padding: '0 2px' }}>
          {useType?.map(item => (
            <Label key={item?.ID} val={item?.ID}>
              <UseTypeInput val={item?.ID} checked={data?.USE_TYPE === item?.ID} 
                onChange={e => setData(prev => ({...prev, USE_TYPE: e.target.checked && item?.ID}))}
              />
              <LabelText>{item?.NAME}</LabelText>
            </Label>
          ))}
        </Row>
        <Row>
          사용 기간: 
          <Input value={data?.USE_DAY ?? ''}
            onChange={e => setData(prev => ({...prev, USE_DAY: e.target.value}))}
          />일
        </Row>
        {data?.USE_TYPE === 1 && (
          <Row>
            사용 횟수: 
            <Input value={data?.USE_COUNT ?? ''}
              onChange={e => setData(prev => ({...prev, USE_COUNT: e.target.value}))}
            />회
          </Row>
        )}
        <Row>
          이용권 금액: 
          <Input value={data?.PLACE ?? ''} style={{ minWidth: 110 }}
            onChange={e => setData(prev => ({...prev, PLACE: useNumber(e.target.value)}))}
          />원
        </Row>
      </Body>
      <ButtonWrap className='buttonWrap'>
        <Button className='col' onClick={validate}>저장</Button>
        <Button className='red col' onClick={() => setIsCreate(false)}>취소</Button>
      </ButtonWrap>
    </Wrap>
  )
}

const Wrap = Styled.li`
  padding: 14px 10px 10px;
  min-width: 230px;
  max-width: 230px;
  height: 240px;
  border: 1px solid #c9ebe7;
  border-radius: 5px;
  box-shadow: 0px 3px 4px #00000020;
  margin: 0 10px 10px 0;
  font-size: 13px;
  color: #333;
  display: flex;
  align-items: flex-start;
  flex-flow: column;
`;
const Body = Styled.section`
  width: 100%;
  flex: 1;
`;
const Row = Styled.div`
  font-size: 12px;
  margin-bottom: 5px;
  width: 100%;
  white-space: nowrap;
`;
const ButtonWrap = Styled.div`
  width: 100%;
  padding-top: 10px;
  justify-content: space-between;
`;
const Button = Styled.button`
  width: 100%;
  margin-bottom: 5px;
  height: 28px;
  line-height: 26px;
  font-size: 12px;
  &.col {
    margin-bottom: 0;
    width: calc(50% - 5px);
  }
`;
const NameInput = Styled.input.attrs(() => ({ type: 'text', placeholder: '이용권 이름' }))`
  transition: .2s;
  width: 100%;
  height: 36px !important;
  border-color: #dddddd00 !important;
  background-color: #ffffff00 !important;
  font-size: 16px !important;
  &:focus, &:hover {
    border: 1px solid #ddd !important;
    background-color: #ffffff !important;
  }
`;
const Label = Styled.label.attrs(x => ({ htmlFor: 'useType' + x.val }))`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 0;
  margin-right: 10px;
  &:last-of-type {
    margin-right: 0;
  }
`;
const UseTypeInput = Styled.input.attrs(x => ({ type: 'radio', name: 'useType', id: 'useType' + x.val, value: x.val }))`
  transform: translateY(1px);
  margin-right: 4px;
`;
const LabelText = Styled.span``;
const Input = Styled.input`
  flex: 1;
  min-width: 70px;
  max-width: 70px;
  margin: 0 5px;
`;