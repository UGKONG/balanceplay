import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import Styled from 'styled-components';
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';

export default function ({ 
  id, title, allCount, 
  userName, userAuthId, userEmail, userPlatform, userImg, 
  next, setTotalData 
}) {
  const [centerList, setCenterList] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authId, setAuthId] = useState('');
  const [authSns, setAuthSns] = useState('');
  const [img, setImg] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('M');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [ogdpType, setOgdpType] = useState({ id: 1, text: '어린이집 및 유치원' });
  const [ogdpName, setOgdpName] = useState('');
  const [center, setCenter] = useState('');
  const [visitObj, setVisitObj] = useState('');
  const visitObjList = useRef([
    { id: 1, name: 'SNS', value: 'sns' },
    { id: 2, name: '지인소개', value: 'friend' },
    { id: 3, name: '인터넷 검색', value: 'internet' },
    { id: 4, name: '기타', value: 'other' },
  ]);

  const getCenter = () => {
    useAxios.get('/center').then(({ data }) => {
      if (!data?.result || data?.data?.length === 0) {
        setCenterList([]);
        return;
      }
      setCenterList(data?.data);
    })
  }
  const visitObjChange = () => {
    let inputList = document.querySelectorAll('[id^="visitObj_"]');
    let temp = { values: [], names: [] };
    inputList.forEach(el => {
      if (el.checked) {
        let find = visitObjList.current.find(x => x.id == el.value);
        if (find) {
          temp.values.push(find.id);
          temp.names.push(find.name);
        }
      }
    });
    setVisitObj(temp);
  }
  const savePrevData = () => {
    setName(userName ?? null);
    setEmail(userEmail ?? null);
    setAuthId(userAuthId ?? null);
    setAuthSns(userPlatform ?? null);
    setImg(userImg ?? null);
  }
  const validator = () => {
    if (!name || !birth || !height || !weight || !ogdpName) return useAlert.warn('초기면접지', '빈칸을 작성해주세요.');
    if (birth.length < 6) return useAlert.warn('초기면접지', '생년월일을 옳바르게 입력해주세요.');
    if (ogdpName.length < 4) return useAlert.warn('초기면접지', '소속기관 이름을 옳바르게 입력해주세요.');
    if (!center || !center?.ID) return useAlert.warn('초기면접지', '센터를 선택해주세요');
    if (!visitObj || visitObj?.values?.length === 0) return useAlert.info('초기면접지', '방문동기를 선택해주세요.');

    setTotalData(x => {
      let temp = {...x};
      let data = { 
        name, email, center, authId, authSns, img, birth, gender, 
        height, weight, ogdpType, ogdpName, visitObj 
      };
      temp.info = {...data};
      return temp;
    });
    next();
  }

  useEffect(getCenter, []);
  useEffect(savePrevData, []);

  return (
    <>
      <h2>{title} ({id}/{allCount})</h2>
      <Row>
        <label htmlFor='name'>이름</label>
        <input id='name' value={name ?? ''} placeholder='홍길동' autoComplete='false'
          onChange={e => setName(e.target.value)}
        />
      </Row>
      <Row>
        <Col>
          <label htmlFor='birth'>생년월일</label>
          <input type='date' id='birth' value={birth ?? ''} placeholder='YYYYMMDD' autoComplete='false' minLength={8} maxLength={8}
            onChange={e => setBirth(e.target.value)} 
          />
        </Col>
        <Col>
          <label>성별</label>
          <p>
            <input type='radio' name='gender' id='M' checked={gender === 'M'} 
              onChange={e => setGender(e.target.checked && 'M')} 
            />
            <label htmlFor='M'>남자</label>
          </p>
          <p>
            <input type='radio' name='gender' id='F' checked={gender === 'F'} 
              onChange={e => setGender(e.target.checked && 'F')} 
            />
            <label htmlFor='F'>여자</label>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <label htmlFor='height'>신장</label>
          <input type='number' id='height' value={height} autoComplete='false' max={300}
            onChange={e => setHeight(e.target.value)} 
          />
          <span>cm</span>
        </Col>
        <Col>
          <label htmlFor='weight'>체중</label>
          <input type='number' id='weight' value={weight} autoComplete='false' max={200}
            onChange={e => setWeight(e.target.value)} 
          />
          <span>kg</span>
        </Col>
      </Row>
      <Row>
        <label>소속기관</label>
        <p>
          <input type='radio' name='ogdpType' id='ogdpType1' checked={ogdpType?.id === 1} 
            onChange={e => setOgdpType(e.target.checked && {id: 1, 'text': '어린이집 및 유치원'})} 
          />
          <label htmlFor='ogdpType1'>어린이집 및 유치원</label>
          <input type='radio' name='ogdpType' id='ogdpType2' checked={ogdpType?.id === 2} 
            onChange={e => setOgdpType(e.target.checked && {id: 2, 'text': '초등학교'})} 
          />
          <label htmlFor='ogdpType2'>초등학교</label>
        </p>
      </Row>
      <Row>
        <label htmlFor='ogdpName'>소속기관 이름</label>
        <input id='ogdpName' value={ogdpName} 
          placeholder={ogdpType?.id === 1 ? 'OO 어린이집 또는 OO 유치원' : 'OO 초등학교'} 
          onChange={e => setOgdpName(e.target.value)} 
        />
      </Row>
      <Row>
        <label htmlFor="center">센터선택</label>
        <Select id="center" onChange={e => setCenter(centerList.find(x => x?.ID == e.target.value) ?? null)}>
          <option value=''>센터선택</option>
          {centerList.length > 0 && centerList.map(item => (
            <option value={item?.ID}>{item?.NAME} / {item?.CENTER_PHONE || '연락처 없음'}</option>
          ))}
        </Select>
      </Row>
      <Row>
        <label>방문동기</label>
        <List>
          {visitObjList.current.map(item => (
            <li key={item.id}>
              <input type='checkbox' name='visitObj' id={'visitObj_' + item.value} value={item.id} 
                onChange={visitObjChange} 
              />
              <label htmlFor={'visitObj_' + item.value}>{item.name}</label>
            </li>
          ))}
        </List>
      </Row>
      <div>
        <NextBtn className='btn' onClick={validator}>다음</NextBtn>
      </div>
    </>
  )
}

const Row = Styled.div`
  margin-bottom: 20px;
  overflow: auto;
  input:not([type="radio"], [type="checkbox"], [type="number"]) {
    width: 100%;
  }
  input[type="checkbox"],
  input[type="radio"] {
    margin-right: 4px;
    & + label {
      display: inline-block;
      margin-right: 10px;
    }
  }
  label {
    display: block;
    font-size: 14px;
    font-weight: 400;
    color: #282828;
    letter-spacing: 1px;
    margin-bottom: 5px;
    white-space: nowrap;
  }
  p {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }
`;
const Col = Styled.div`
  width: 50%;
  float: left;
  &:first-of-type {
    padding-right: 20px;
  }
  &:last-of-type {
    padding-left: 20px;
  }
  input[type="number"] {
    width: calc(100% - 28px);
  }
  label {
    display: block;
    width: 100%;
  }
  span {
    display: inline-block;
    width: 22px;
    font-size: 13px;
    font-weight: 400;
    color: #777;
    letter-spacing: 2px;
    margin-left: 5px;
  }
  p {
    width: unset;
    label {
      margin-bottom: 2px;
    }
  }
`;
const List = Styled.ul`
  li {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 5px;

    input {
      border: 1px solid #ddd;
      margin-right: 5px;
      &:checked + label {
        color: #282828;
      }
    }
    label {
      padding: 3px 0;
      width: 200px;
      color: #777;
    }
  }
`;
const Select = Styled.select`
  width: 100%;
  color: #888;
  &:focus {
    color: #222;
  }
`;
const NextBtn = Styled.button`
  width: 100%;
  margin: 0;
`;