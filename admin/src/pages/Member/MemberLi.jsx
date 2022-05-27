import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import TableCheckbox from '../Common/TableCheckbox';
import useDate from '%/useDate';

export default function 회원리스트 ({ item, idx, checkList, setCheckList }) {
  const navigate = useNavigate();
  
  const onClick = () => {
    navigate(String(item?.ID));
  }

  const onChange = bool => {
    let otherArr = checkList?.filter(x => x.ID !== item?.ID);
    if (bool) otherArr.push(item);
    setCheckList(otherArr);
  }

  const checked = useMemo(() => {
    let find = checkList?.find(x => x.ID === item?.ID);
    return find ? true : false;
  }, [checkList]);

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

  return (
    <Tr>
      <Td>
        <TableCheckbox checked={checked} onChange={onChange} />
      </Td>
      <Td onClick={onClick}>{idx + 1}</Td>
      <Td onClick={onClick}>{item?.NAME}</Td>
      <Td onClick={onClick}>{item?.GENDER === 'M' ? '남자' : item?.GENDER === 'F' ? '여자' : ''}</Td>
      <Td onClick={onClick}>{item?.HEIGHT ?? '-'}Cm</Td>
      <Td onClick={onClick}>{item?.WEIGHT ?? '-'}Kg</Td>
      <Td onClick={onClick}>{activeVoucherCount}개</Td>
      <Td onClick={onClick}>{item?.TEST_FLAG === 1 ? '예' : '아니오'}</Td>
      <Td onClick={onClick}>{item?.PLATFORM === 'kakao' ? '카카오톡' : '네이버'}</Td>
      <Td onClick={onClick}>{item?.DATE?.split(' ')[0]}</Td>
    </Tr>
  )
}

const Tr = Styled.tr`
  height: 41px;
  cursor: pointer;
`;
const Td = Styled.td`
`;