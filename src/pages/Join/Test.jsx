import React, { useRef, useState } from 'react';
import Styled from 'styled-components';
import useAlert from '%/useAlert';

export default function ({ id, title, allCount, next, setTotalData }) {
  const [data, setData] = useState(null);
  const askList = useRef([
    { id: 1, name: "말, 몸짓 등 표현이 전혀 없으며, 언어를 이해하지 못한다." },
    { id: 2, name: "말 없이 몸짓 등으로 표현이 가능하며, 언어를 조금 이해한다." },
    { id: 3, name: "간단한 언어 표현이 가능하며, 익숙한 표현과 질문에 대해 이해한다." },
    { id: 4, name: "언어표현을 잘하며, 언어를 모두 이해한다." },
  ]);

  const validator = () => {
    if (!data) return useAlert.warn('초기면접지', '항목을 선택해주세요.');

    setTotalData(prev => {
      let temp = {...prev};
      temp.test = askList.current.find(x => x.id === Number(data));
      return temp;
    });
    next();
  }

  return (
    <>
      <h2>{title} ({id}/{allCount})</h2>
      {askList.current.map(item => (
        <Li key={item.id}>
          <input type='radio' name='test_chk' id={'c_' + item.id} value={item.id} onChange={e => setData(e.target.value)} />
          <label htmlFor={'c_' + item.id}>{item.name}</label>
        </Li>
      ))}
      <div>
        <NextBtn onClick={validator}>다음</NextBtn>
      </div>
    </>
  )
}

const Li = Styled.li`
  input {
    display: none;
    &:checked + label {
      background-color: #00ada9;
      color: #fff;
      box-shadow: 0 0 5px #777;
    }
  }
  label {
    display: block;
    background-color: #ddd;
    font-size: 13px;
    color: #777;
    width: 100%;
    height: unset;
    padding: 6px 15px;
    text-align: center;
    word-break: keep-all;
    border: none;
    border-radius: 100px;
    margin-bottom: 10px;
    cursor: pointer;
  }
`;
const NextBtn = Styled.button`
  width: 100%;
  margin: 40px 0 60px;
`;