import React, { useMemo } from 'react';
import Styled from 'styled-components';
import TableCheckbox from '../Common/TableCheckbox';
import useNumber from '%/useNumber';
import { useNavigate } from 'react-router-dom';

export default function 입출금리스트 ({ item, idx, checkList, setCheckList }) {
  const navigate = useNavigate();

  const onChange = bool => {
    let otherArr = checkList?.filter(x => x.ID !== item?.ID);
    if (bool) otherArr.push(item);
    setCheckList(otherArr);
  }
  const edit = () => navigate('/accountModify/' + item?.ID);

  const checked = useMemo(() => {
    let find = checkList?.find(x => x.ID === item?.ID);
    return find ? true : false;
  }, [checkList]);

  return (
    <Tr>
      <Td>
        {item?.IS_AUTO === 0 && <TableCheckbox checked={checked} onChange={onChange} />}
      </Td>
      <Td>{idx + 1}</Td>
      <Td>{item?.CREATE_DATE}</Td>
      <Td>{item?.CATEGORY_NAME ?? '-'}</Td>
      <Td>{item?.DESCRIPTION ?? '-'}</Td>
      {item?.MONEY_TYPE === 1 ? (
        <>
          <Td>{useNumber(item?.MONEY ?? 0)}원</Td>
          <Td>-</Td>
        </>
      ) : item?.MONEY_TYPE === 2 ? (
        <>
          <Td>-</Td>
          <Td>{useNumber(item?.MONEY ?? 0)}원</Td>
        </>
      ) : (
        <>
          <Td>-</Td>
          <Td>-</Td>
        </>
      )}
      <Td>
        {item?.IS_AUTO === 0 ? <EditBtn onClick={edit}>수정</EditBtn> : <NotEdit>수정불가</NotEdit>}
      </Td>
    </Tr>
  )
}

const Tr = Styled.tr`
  height: 41px;
`;
const Td = Styled.td`
  &:last-of-type {
    padding: 0;
  }
`;
const EditBtn = Styled.button`
  width: 100%;
  height: 41px;
  border-radius: 0;
`;
const NotEdit = Styled.span`
  font-size: 12px;
  color: #777;
  width: 100%;
  display: block;
  text-align: center;
`;