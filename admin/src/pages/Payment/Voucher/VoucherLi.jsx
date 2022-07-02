import React from 'react';
import Styled from 'styled-components';
import useNumber from '%/useNumber';

export default function 이용권리스트 ({ data, setVoucherId }) {

  const choice = () => {
    let ask = confirm(data?.NAME + ' 이용권을 선택하시겠습니까?');
    if (!ask) return;
    setVoucherId(Number(data?.ID));
  }

  return (
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
      <ButtonWrap>
        <Button onClick={choice}>선택</Button>
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
  display: flex !important;
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
`;