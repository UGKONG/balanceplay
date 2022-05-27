import React from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';

export default function 메인검사 ({ idx, item }) {
  if (!item?.ID) return null;
  const navigate = useNavigate();

  const onClick = () => {
    if (item?.ID === 2) return;
    navigate('/survey/' + item?.ID + '/', { state: { METHOD: item?.METHOD } });
  }

  return (
    <Wrap>
      <Td>
        <Header>
          <Number>{idx + 1}</Number>
          <Title itemId={item?.ID} onClick={onClick}>{item?.NAME}</Title>
          <Method>{item?.METHOD_TEXT}</Method>
        </Header>
        <Description>{item.DESCRIPTION}</Description>
      </Td>
    </Wrap>
  )
}

const Wrap = Styled.tr`
  margin-bottom: 30px;
`;
const Td = Styled.td`
  padding: 0;
`;
const Header = Styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #12af90;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-top: 2px solid #12af90;
  border-bottom: 1px solid #ddd;
`;
const Number = Styled.p`
  padding: 10px;
  width: 42px;
  border-right: 1px solid #ddd;
  text-align: center;
`;
const Title = Styled.p`
  padding: 10px;
  cursor: ${x => x.itemId === 2 ? null : 'pointer'};

  &:hover {
    color: ${x => x.itemId === 2 ? 'unset' : '#0f987c'};
  }
`;
const Method = Styled.p`
  font-size: 12px;
  flex: 1;
  text-align: right;
  padding: 0 10px;
`;
const Description = Styled.p`
  font-size: 13px;
  color: #333;
  padding: 10px 10px 20px;
  white-space: pre-wrap;
`;