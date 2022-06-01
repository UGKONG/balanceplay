import React, { useState, useEffect, useMemo } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useNumber from '%/useNumber';
import VoucherModify from './VoucherModify';

export default function 이용권리스트 ({ data, getList }) {
  const [isEdit, setIsEdit] = useState(false);

  const deleteVoucher = () => {
    let ask = confirm('해당 이용권을 삭제하시겠습니까?');
    if (!ask) return;

    useAxios.delete('/voucher/' + data?.ID).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '해당 이용권이 삭제되었습니다.');
      getList();
    });
  }

  return isEdit ? (
    <VoucherModify _data={data} getList={getList} setIsEdit={setIsEdit} />
  ) : (
    <Wrap>
      <Head>
        <Row color='#777'>{data?.USE_TYPE_NAME} 이용권</Row>
        <Name>{data?.NAME}</Name>
      </Head>
      <Body>
        {data?.USE_COUNT && <Row>사용가능 횟수: {data?.USE_COUNT}회</Row>}
        {data?.USE_DAY && <Row>사용가능 기간: {data?.USE_DAY}일</Row>}
        <Pay>{useNumber(data?.PLACE)}원</Pay>
      </Body>
      <ButtonWrap className='buttonWrap'>
        <Button className='col' onClick={() => setIsEdit(true)}>수정</Button>
        <Button className='red col' onClick={deleteVoucher}>삭제</Button>
      </ButtonWrap>
    </Wrap>
  )
}

const Wrap = Styled.li`
  padding: 10px;
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
  &:hover > .buttonWrap {
    display: flex !important;
  }
`;
const Head = Styled.section`
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
`;
const Body = Styled.section`
  width: 100%;
  flex: 1;
`;
const Name = Styled.p`
  font-size: 16px;
  font-weight: 500;
  width: 100%;
`;
const Pay = Styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #008a87;
  padding: 10px 0 10px;
`;
const Row = Styled.div`
  font-size: 12px;
  margin-bottom: 4px;
  width: 100%;
  color: ${x => x?.color ?? '#333'};
`;
const ButtonWrap = Styled.div`
  display: none !important;
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