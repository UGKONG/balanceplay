import React, { useRef, useState } from 'react';
import { IoOptionsOutline, IoCloseOutline } from 'react-icons/io5';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';

export default function 예약회원_아이템({ data, getUser }) {
  const btns = useRef([
    { id: 2, name: '출석', color: '#00ada9' },
    { id: 3, name: '결석', color: '#f13535' },
    { id: 4, name: '취소', color: '#777777' },
  ]);
  const [isOption, setIsOption] = useState(false);

  const statusChange = (status, statusName) => {
    useAxios.put('/reservation/' + data?.ID + '/' + status).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
      useAlert.success('알림', statusName + '되었습니다.');
      setIsOption(false);
      getUser();
    });
  };

  return (
    <Container onMouseLeave={() => setIsOption(false)}>
      {isOption ? (
        <StatusBtns>
          <span>{data?.USER_NAME}</span>
          {btns?.current?.map((item) => (
            <Button
              key={item?.id}
              color={item?.color}
              onClick={() => statusChange(item?.id, item?.name)}
            >
              {item?.name}
            </Button>
          ))}
          <OptionCloseBtn onClick={() => setIsOption(false)} />
        </StatusBtns>
      ) : (
        <>
          <Name>{data?.USER_NAME}</Name>
          <Status>{data?.STATUS_NAME}</Status>
          <OptionBtn onClick={() => setIsOption(true)} />
        </>
      )}
    </Container>
  );
}

const Container = Styled.article`
  padding: 0 5px;
  height: 36px;
  color: #666;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  &:hover {
    background-color: #ffffff88;
    color: #000;
  }
`;
const Name = Styled.p`
  width: 50px;
  padding-left: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Status = Styled.p`
  
`;
const OptionBtn = Styled(IoOptionsOutline)`
  width: 22px;
  height: 22px;
  cursor: pointer;
`;
const StatusBtns = Styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  & > span {
    width: 50px;
    flex: 1;
    padding: 0 4px 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const Button = Styled.button`
  height: 24px;
  font-size: 12px;
  line-height: 22px;
  border: none;
  color: #fff;
  margin-right: 5px;
  padding: 0 8px;
  background-color: ${(x) => x?.color ?? 'inherit'} !important;
  box-shadow: none !important;

  &:hover {
    border: none !important;
    background-color: ${(x) => x?.color ?? 'inherit'} !important;
  }
`;
const OptionCloseBtn = Styled(IoCloseOutline)`
  width: 24px;
  height: 24px;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  color: #999;
  &:hover {
    color: #777;
  }
`;
