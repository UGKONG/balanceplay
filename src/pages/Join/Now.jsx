import React, { useRef, useState } from 'react';
import Styled from 'styled-components';
import useAlert from '%/useAlert';

export default function ({ id, title, allCount, next, setTotalData }) {
  const [data, setData] = useState([
    { id: 1, title: '생활습관', name: '수면', value: null },
    { id: 2, title: '생활습관', name: '배변', value: null },
    { id: 3, title: '생활습관', name: '식사', value: null },
    { id: 4, title: '사회성 수준', name: '또래관계', value: null },
    { id: 5, title: '사회성 수준', name: '가족관계', value: null },
  ]);
  const askList = useRef({
    life: {
      title: '생활습관',
      list: [
        { id: 1, name: '수면' },
        { id: 2, name: '배변' },
        { id: 3, name: '식사' },
      ]
    },
    society: {
      title: '사회성 수준',
      list: [
        { id: 4, name: '또래관계' },
        { id: 5, name: '가족관계' },
      ]
    },
  });

  const change = e => {
    let askId = e.target.id?.split('_')[1];
    let value = e.target.value;
    let temp = [...data];
    let findIdx = temp?.findIndex(x => x.id == askId);
    temp[findIdx].value = value;
    setData(temp);
  }
  const validator = () => {
    let filter = data?.filter(x => !x.value);
    if (filter.length > 0) return useAlert.warn('초기면접지', '항목을 선택해주세요.');

    setTotalData(prev => {
      let temp = {...prev};
      temp.now = data;
      return temp;
    });
    next();
  }

  return (
    <>
      <h2>{title} ({id}/{allCount})</h2>
      <Title>{askList.current.life.title}</Title>
      <List>
        {askList.current.life.list.map(item => (
          <Li key={item.id}>
            <SubTitle>{item.name}</SubTitle>
            <input type='radio' name={`t_${item.id}`} id={`t_${item.id}_1`} value='1' onChange={change} />
            <label htmlFor={`t_${item.id}_1`}>양호</label>
            <input type='radio' name={`t_${item.id}`} id={`t_${item.id}_2`} value='2' onChange={change} />
            <label htmlFor={`t_${item.id}_2`}>개선필요</label>
          </Li>
        ))}
      </List>
      <Title>{askList.current.society.title}</Title>
      <List>
        {askList.current.society.list.map(item => (
          <Li key={item.id}>
            <SubTitle>{item.name}</SubTitle>
            <input type='radio' name={`t_${item.id}`} id={`t_${item.id}_1`} value='1' onChange={change} />
            <label htmlFor={`t_${item.id}_1`}>양호</label>
            <input type='radio' name={`t_${item.id}`} id={`t_${item.id}_2`} value='2' onChange={change} />
            <label htmlFor={`t_${item.id}_2`}>개선필요</label>
          </Li>
        ))}
      </List>
      <Row>
        <NextBtn onClick={validator}>다음</NextBtn>
      </Row>
    </>
  )
}

const Row = Styled.div``;
const List = Styled.ul`
  margin-bottom: 10px;
`;
const Li = Styled.li`
  padding: 10px 0;
  margin-bottom: 14px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  input {
    display: none;
    &:checked + label {
      background-color: #00ada9;
      color: #fff;
      box-shadow: 0 0 5px #777;
    }
  }
  label {
    font-size: 13px;
    font-weight: 400;
    color: #777;
    width: 64px;
    min-width: 64px;
    max-width: 64px;
    height: 64px;
    min-height: 64px;
    max-height: 64px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-flow: row;
    flex-wrap: nowrap;
    border: none;
    border-radius: 50px;
    background-color: #ddd;
    margin: 4px 0;
    cursor: pointer;
    &:first-of-type {
      margin-left: 20vw;
    }
    &:last-of-type {
      margin-right: 20vw;
    }
  }
`;
const Title = Styled.h3`
  margin: 10px 0 10px;
  font-size: 16px;
  font-weight: 500;
  color: #008a87;
`;
const SubTitle = Styled.h4`
  font-size: 14px;
  padding-bottom: 10px;
  font-weight: 500;
  color: #008a87;
  width: 100%;
`;
const NextBtn = Styled.button`
  width: 100%;
  margin: 0;
`;