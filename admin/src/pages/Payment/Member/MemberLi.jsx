import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import useDate from '%/useDate';

export default function 회원리스트 ({ item, idx, setUserId }) {

  const activeVoucherCount = useMemo(() => {
    let activeCount = 0;
    let now = new Date(useDate(new Date(), 'date'));
    if (item?.VOUCHER?.length === 0) return 0;

    item?.VOUCHER?.filter(x => {
      let type = x?.USE_TYPE;
      if (type === 1) {  // COUNT
        let targetCount = x?.REMAIN_COUNT ?? 0;
        let targetDate = new Date(x?.REMAIN_DATE);
        if (targetCount > 0 && targetDate.getTime() >= now.getTime()) activeCount += 1;
      } else {  // DATE
        let targetDate = new Date(x?.REMAIN_DATE);
        if (targetDate.getTime() >= now.getTime()) activeCount += 1;
      }
    });

    return activeCount ?? 0;
  }, [item?.VOUCHER]);

  const choice = () => {
    let ask = confirm(item?.NAME + ' 회원을 선택하시겠습니까?');
    if (!ask) return;
    setUserId(Number(item?.ID));
  }

  return (
    <Tr onClick={choice}>
      <Td>{idx + 1}</Td>
      <Td>{item?.NAME}</Td>
      <Td>{item?.GENDER === 'M' ? '남자' : item?.GENDER === 'F' ? '여자' : ''}</Td>
      <Td>{item?.HEIGHT ?? '-'}Cm</Td>
      <Td>{item?.WEIGHT ?? '-'}Kg</Td>
      <Td>{activeVoucherCount}개</Td>
      <Td>{item?.TEST_FLAG === 1 ? '예' : '아니오'}</Td>
      <Td>{item?.PLATFORM === 'kakao' ? '카카오톡' : '네이버'}</Td>
      <Td>{item?.DATE?.split(' ')[0]}</Td>
    </Tr>
  )
}

const Tr = Styled.tr`
  height: 41px;
  cursor: pointer;
`;
const Td = Styled.td`
`;