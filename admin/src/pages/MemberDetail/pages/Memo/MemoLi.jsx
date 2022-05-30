import React, { useState, useEffect, useMemo } from 'react';
import Styled from 'styled-components';
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';
import { FiCheck, FiEdit, FiX } from "react-icons/fi";

export default function 메모리스트 ({ data, getList }) {
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(data);
  const [inputSize, setInputSize] = useState('unset');

  const edit = () => {
    setInputSize(data?.MEMO?.length > 50 ? '100%' : 'unset'); 
    setIsEdit(true);
  }
  const save = () => {
    if (editData?.MEMO?.trim() === '') return;
    useAxios.put('/userMemo/' + data?.ID, { value: editData?.MEMO }).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      getList();
      setIsEdit(false);
    })
  }
  const deleteMemo = () => {
    let ask = confirm('해당 메모를 삭제하시겠습니까?');
    if (!ask) return;
    useAxios.delete('/userMemo/' + data?.ID).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', '삭제되었습니다.');
      getList();
    })
  }
  const date = useMemo(() => data?.CREATE_DT?.replaceAll('-', '.')?.split(' ')[0], [data]);

  return (
    <Container>
      <Wrap style={{ width: inputSize }}>
        {isEdit ? (
          <>
            <Input 
              defaultValue={editData?.MEMO} 
              onChange={e => setEditData(prev => ({ ...prev, MEMO: e.target.value }))} 
            />
            <SaveBtn onClick={save} />
            <CancelBtn onClick={() => setIsEdit(false)} />
          </>
        ) : (
          <>
            {data?.MEMO}
            <Option>
              <Btns>
                {data?.IS_UPDATE === 1 && <Edited>수정됨</Edited>}
                <EditBtn onClick={edit} />
                <DeleteBtn onClick={deleteMemo} />
              </Btns>
              <Date>{date}</Date>
            </Option>
          </>
        )}
      </Wrap>
    </Container>
  )
}

const Container = Styled.li`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`;
const Wrap = Styled.div`
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  font-size: 13px;
  margin-bottom: 10px;
  border: 1px solid #c9ebe7;
  position: relative;
  max-width: calc(100% - 70px);
  &:hover > div {
    & > div > svg {
      width: unset;
      padding: 2px;
      margin: 0 -2px 0 3px;
    }
  }
`;
const Option = Styled.div`
  display: flex;
  align-items: flex-start !important;
  justify-content: center;
  flex-flow: column;
  font-size: 12px;
  position: absolute;
  left: calc(100%);
  top: 0;
  color: #999;
  width: 70px;
  height: 100%;
  justify-content: space-between;
  padding: 2px 0px 2px 5px;
`;
const Edited = Styled.p`
  white-space: nowrap;
  padding-left: 2px;
`;
const Btns = Styled.div`
  align-items: center;
  overflow: hidden;
`;
const EditBtn = Styled(FiEdit)`
  opacity: .5;
  cursor: pointer;
  padding: 2px;
  font-size: 18px;
  width: 0;
  padding: 0;
  &:hover {
    color: #000;
  }
`;
const DeleteBtn = Styled(FiX)`
  opacity: .5;
  cursor: pointer;
  font-size: 18px;
  width: 0;
  padding: 0;
  &:hover {
    color: #000;
  }
`;
const SaveBtn = Styled(FiCheck)`
  color: #999;
  cursor: pointer;
  font-size: 26px;
  width: 25px;
  height: 30px;
  padding: 4px;
  &:hover {
    color: #000;
  }
`;
const CancelBtn = Styled(FiX)`
  color: #999;
  cursor: pointer;
  font-size: 26px;
  width: 25px;
  height: 30px;
  padding: 4px;
  &:hover {
    color: #000;
  }
`;
const Date = Styled.p`
  white-space: nowrap;
  font-size: 11px;
  margin-top: 4px;
  letter-spacing: 1px;
`;
const Input = Styled.input`
  flex: 1;
  margin-right: 4px;
`;