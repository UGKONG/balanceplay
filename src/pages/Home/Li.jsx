import React from 'react';
import Styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function TestResultLi ({ date, list }) {
  const navigate = useNavigate();
  const timeView = t => t?.split(' ')[1];
  const listClick = () => navigate('/totalresult/' + date);

	return (
		<Wrap onClick={listClick}>
      <Date>{date ?? '-'}</Date>
      <List>
        {list.length > 0 && list.map(item => (
          <Li key={item?.ID}>{timeView(item?.DATE) ?? '-'}</Li>
        ))}
      </List>
      <List>
        {list.length > 0 && list.map(item => (
          <Li key={item?.ID}>
            {item?.ICON && <Icon src={item?.ICON} alt='아이콘' />}
            {item?.TEST_NAME && <TestName>{item?.TEST_NAME}</TestName>}
          </Li>
        ))}
      </List>
    </Wrap>
	)
}

const Wrap = Styled.tr`
  cursor: pointer;
`;
const Date = Styled.td`
  letter-spacing: 1px;
  white-space: nowrap;
`;
const List = Styled.td`
  @media screen and (max-width: 500px) {
    &:nth-of-type(2) {
      display: none;
    }
  }
`;
const Li = Styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 25px;
  margin-bottom: 3px;
  &:last-of-type {
    margin-bottom: 0;
  }
`;
const Icon = Styled.img`
  margin-right: 4px;
`;
const TestName = Styled.span`
  
`;