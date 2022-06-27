import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import Checkbox from '%/Checkbox';
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';
import useNumber from '%/useNumber';

export default function 입출금내역수정 () {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState({});
  const [categoryList, setCategoryList] = useState([]);

  const getData = () => {
    useAxios.get('/account/' + id).then(({ data }) => {
      if (!data?.result || !data?.data) {
        useAlert.error('알림', '내역이 존재하지 않습니다.');
        navigate('/account');
        return;
      }
      const { category, info } = data?.data;
      setCategoryList(category);
      setData(info);
    })
  }

  const validate = () => {
    if (!data?.CATEGORY) return useAlert.warn('알림', '구분을 선택해주세요.');
    if (!data?.MONEY) return useAlert.warn('알림', '금액을 입력해주세요.');
    if (!data?.DESCRIPTION) return useAlert.warn('알림', '내용을 입력해주세요.');
    
    submit();
  }

  const submit = () => {
    useAxios.put('/account', { data }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '내역이 수정되었습니다.');
      navigate('/account');
    });
  }

  useEffect(getData, []);

  return (
    <PageAnimate>
      <Header>
        <Title>입출금 내역 수정</Title>
      </Header>
      <Contents>
        <Row>
          <RowTitle>구분</RowTitle>
          <RowContents>
            <Select value={data?.CATEGORY ?? ''} onChange={e => setData(prev => ({...prev, CATEGORY: Number(e.target.value)}))}>
              <option value={''}>선택</option>
              {categoryList?.map(item => <option key={item?.ID} value={item?.ID}>{item?.NAME}</option>)}
            </Select>
          </RowContents>
        </Row>
        <Row>
          <RowTitle>입금</RowTitle>
          <RowContents>
            <Checkbox style={checkStyle} checked={data?.MONEY_TYPE === 1} onChange={e => setData(prev => ({...prev, MONEY_TYPE: e ? 1 : 2}))} />
            {data?.MONEY_TYPE === 1 && (
              <>
                <MoneyInput value={data?.MONEY ? useNumber(data?.MONEY) : ''} onChange={e => setData(prev => ({...prev, MONEY: Number(e.target.value?.replaceAll(',', ''))}))} />
                <MoneyDescription>원</MoneyDescription>
              </>
            )}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>출금</RowTitle>
          <RowContents>
            <Checkbox style={checkStyle} checked={data?.MONEY_TYPE === 2} onChange={e => setData(prev => ({...prev, MONEY_TYPE: e ? 2 : 1}))} />
            {data?.MONEY_TYPE === 2 && (
              <>
                <MoneyInput value={data?.MONEY ? useNumber(data?.MONEY) : ''} onChange={e => setData(prev => ({...prev, MONEY: Number(e.target.value?.replaceAll(',', ''))}))} />
                <MoneyDescription>원</MoneyDescription>
              </>
            )}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>내용</RowTitle>
          <RowContents>
            <Input value={data?.DESCRIPTION ?? ''} onChange={e => setData(prev => ({...prev, DESCRIPTION: e.target.value}))} placeholder='내용을 입력하세요.' />
          </RowContents>
        </Row>
        <Row>
          <RowTitle>일시</RowTitle>
          <RowContents>
            {data?.CREATE_DATE}
          </RowContents>
        </Row>
        <Row style={{ justifyContent: 'flex-start' }}>
          <SubmitBtn onClick={validate}>수 정</SubmitBtn>
          <CancelBtn onClick={() => navigate('/account')}>취 소</CancelBtn>
        </Row>
      </Contents>
    </PageAnimate>
  )
}

const Header = Styled.section``;
const Title = Styled.h2``;
const Contents = Styled.section``;
const Row = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 30px;
  width: 100%;
  font-size: 14px;
`;
const RowTitle = Styled.p`
  border-left: 3px solid #00ada9;
  letter-spacing: 1px;
  font-weight: 500;
  text-indent: 8px;
  width: 100px;
  min-width: 100px;
  max-width: 100px;
`;
const RowContents = Styled.div`
  flex: 1;
  color: #444;
`;
const Input = Styled.input`
  flex: 1;
`;
const checkStyle = { marginLeft: 0, marginRight: 10 };
const MoneyInput = Styled(Input).attrs(
  () => ({ placeholder: '금액을 입력해주세요' })
)`
  flex: unset;
  width: 150px;
  text-align: right;
  padding: 0 10px;
`
const MoneyDescription = Styled.span`
  margin-left: 5px;
`
const Select = Styled.select`
  width: 200px;
`
const Textarea = Styled.textarea`
  flex: 1;
  height: 200px;
`;
const SubmitBtn = Styled.button`
  margin-left: 5px;
  margin-right: 10px;
`;
const CancelBtn = Styled.button`

`;