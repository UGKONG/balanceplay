import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import TableCheckbox from '../Common/TableCheckbox';

export default function 공지사항리스트 ({ item, idx, checkList, setCheckList }) {
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

  return (
    <Tr>
      <Td>
        <TableCheckbox checked={checked} onChange={onChange} />
      </Td>
      <Td onClick={onClick}>{idx + 1}</Td>
      <Td onClick={onClick}>{item?.TITLE}</Td>
      <Td onClick={onClick} dangerouslySetInnerHTML={{ __html: item?.CONTENTS?.replaceAll('<br />', ' ') }} />
      <Td onClick={onClick}>{item?.IS_ADMIN_NOTICE ? '예' : '아니오'}</Td>
      <Td onClick={onClick}>{item?.WRITER_NAME}</Td>
      <Td onClick={onClick}>{item?.DATE}</Td>
    </Tr>
  )
}

const Tr = Styled.tr`
  height: 41px;
  cursor: pointer;
`;
const Td = Styled.td`
`;