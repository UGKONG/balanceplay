import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import useAlert from '%/useAlert';

const FamilyLi = ({ item, idx, setData }) => {
  const [type, setType] = useState(item.type);
  const [birth, setBirth] = useState(item.birth);
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [isTogether, setIsTogether] = useState(false);
  const [description, setDescription] = useState('');

  const itemChanged = () => {
    setData(x => {
      let temp = [...x];
      temp[idx] = {
        type, birth, name, height, isTogether, description
      }
      return temp;
    });
  }
    
  useEffect(itemChanged, [type, birth, name, height, isTogether, description]);

  return (
    <li>
      <label htmlFor={'f_' + idx}>
        구성원{idx + 1}. {item.type} ({item.birth})
      </label>
      <input id={'f_' + idx} placeholder='성명' autoComplete='false' value={name}
        onChange={e => setName(e.target.value)}
      />
      <input type='number' placeholder='신장' autoComplete='false' value={height}
        onChange={e => setHeight(e.target.value)}
      />
      <span>
        <input type='checkbox' id={'t_' + idx} value={isTogether}
          onChange={e => setIsTogether(e.target.checked)}
        />
        <label htmlFor={'t_' + idx}>동거여부</label>
      </span>
      <p>
        <input placeholder='기타 설명' autoComplete='false' value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </p>
    </li>
  )
}

export default function ({ id, title, allCount, next, setTotalData }) {
  const [data, setData] = useState([]);
  const familyTypeList = useRef([
    { name: '구성원 추가', value: '' },
    { name: "할아버지", value: "grandFather" },
    { name: "할머니", value: "grandMother" },
    { name: "아버지", value: "father" },
    { name: "어머니", value: "mother" },
    { name: "형", value: "brother" },
    { name: "남동생", value: "youngerBrother" },
    { name: "언니", value: "olderSister" },
    { name: "여동생", value: "youngerSister" },
    { name: "기타", value: "other" },
  ]);

  const [addFamilyType, setAddFamilyType] = useState('');
  const [addBirth, setAddBirth] = useState('');

  const add = () => {
    if (setAddBirth)
    setData(x => {
      let temp = [...x];
      let type = familyTypeList.current.find(x => x.value === addFamilyType)?.name;
      let birth = addBirth;
      temp.push({ id: temp.length + 1, type, birth });
      return temp;
    });
  };

  // 데이터 변경됨
  const dataChanged = () => {
    setAddBirth('');
    setAddFamilyType('');
  }
  
  const validator = () => {
    let nameFilter = data.filter(x => x.name === '').length > 0;
    let heightFilter = data.filter(x => x.height === '').length > 0;
    if (nameFilter) return useAlert.warn('초기면접지', '구성원의 이름을 입력해주세요.');
    if (heightFilter) return useAlert.warn('초기면접지', '구성원의 신장을 입력해주세요.');

    setTotalData(x => {
      let temp = {...x};
      temp.family = [...data];
      return temp;
    });
    next();
  }

  useEffect(dataChanged, [data]);

  return (
    <>
      <h2>{title} ({id}/{allCount})</h2>
      <RowList>
        {data.map((item, idx) => (
          <FamilyLi key={item.id} item={item} idx={idx} setData={setData} />
        ))}
        {data.length === 0 && <li className='list-none'>구성원을 추가해주세요.</li>}
      </RowList>
      
      <AddFamily>
        <select value={addFamilyType} onChange={e => setAddFamilyType(e.target.value)}>
          {familyTypeList.current.map(item => (
            <option key={item.value} value={item.value}>{item.name}</option>
          ))}
        </select>
        {addFamilyType && <input type='date' value={addBirth}
          onChange={e => setAddBirth(e.target.value)} maxLength={6}
        />}
        {addBirth.length >= 6 && <button onClick={add}>추가</button>}
      </AddFamily>
      <div>
        <NextBtn className='btn' onClick={validator}>다음</NextBtn>
      </div>
    </>
  )
}

const RowList = Styled.ul`
  margin-bottom: 20px;
  overflow: auto;
  li {
    flex-wrap: wrap;
    padding: 0;
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    & > label {
      display: block;
      width: 100%;
      margin-bottom: 6px;
    }
    input:not([type="checkbox"], [type="number"]) {
      width: 130px;
      margin-right: 5px;
    }
    input[type="number"] {
      width: 60px;
    }
    & > span {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-left: 10px;
      label {
        font-size: 13px;
        font-weight: 400;
        color: #282828;
        width: unset;
        margin: 0;
        margin-left: 5px;
      }
    }
    p {
      margin-top: 5px;
      width: 100%;
      input {
        width: 100% !important;
        margin: 0 !important;
      }
    }

    &.list-none {
      font-size: 12px;
      font-weight: 400;
      color: #777;
      justify-content: center;
      padding-top: 10px;
    }
  }
`;
const AddFamily = Styled.div`
  margin: 20px 0 15px;
  select {
    width: 100px;
    margin-right: 5px;
    &:nth-of-type(2) {
      width: 94px;
    }
  }
  input {
    margin-right: 5px;
    width: 120px;
  }
  button {
    margin: 0;
  }
`;
const NextBtn = Styled.button`
  width: 100%;
  margin: 0;
`;