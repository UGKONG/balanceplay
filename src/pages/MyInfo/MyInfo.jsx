import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';

export default function 나의정보 ({ data, isEdit, editData, setEditData }) {
  const [centerList, setCenterList] = useState([]);
  
  const getCenterList = () => {
    useAxios.get('/center').then(({ data }) => {
      setCenterList(data?.data ?? []);
    })
  }

  useEffect(getCenterList, [data]);

  return (
    <Wrap>
      <Row>
        <SubTitle>이름</SubTitle>
        {isEdit ? (
          <EditContents>
            <TextInput defaultValue={editData?.NAME} placeholder='이름' 
              onChange={e => setEditData(prev => ({...prev, NAME: e.target.value}))}
            />
          </EditContents>
        ) : (
          <Contents>{data?.NAME}</Contents>
        )}
      </Row>
      <Row>
        <SubTitle>성별</SubTitle>
        {isEdit ? (
          <EditContents>
            <RadioGroup>
              <RadioInput type='radio' id='genderM' name='gender' value='M' 
                onChange={e => setEditData(prev => ({...prev, GENDER: 'M'}))}
                defaultChecked={editData?.GENDER === 'M'}
              />
              <Label htmlFor='genderM'>남자</Label>
            </RadioGroup>
            <RadioGroup>
              <RadioInput type='radio' id='genderF' name='gender' value='F' 
                onChange={e => setEditData(prev => ({...prev, GENDER: 'F'}))}
                defaultChecked={editData?.GENDER === 'F'}
              />
              <Label htmlFor='genderF'>여자</Label>
            </RadioGroup>
          </EditContents>
        ) : (
          <Contents>{data?.GENDER === 'M' ? '남자' : '여자'}</Contents>
        )}
      </Row>
      <Row>
        <SubTitle>신장</SubTitle>
        {isEdit ? (
          <EditContents>
            <TextInput defaultValue={editData?.HEIGHT} placeholder='신장' isNum={true}
              onChange={e => setEditData(prev => ({...prev, HEIGHT: e.target.value}))}
            /> Cm
          </EditContents>
        ) : (
          <Contents>{data?.HEIGHT}Cm</Contents>
        )}
      </Row>
      <Row>
        <SubTitle>체중</SubTitle>
        {isEdit ? (
          <EditContents>
            <TextInput defaultValue={editData?.WEIGHT} placeholder='체중' isNum={true}
              onChange={e => setEditData(prev => ({...prev, WEIGHT: e.target.value}))}
            /> Kg
          </EditContents>
        ) : (
          <Contents>{data?.WEIGHT}Kg</Contents>
        )}
      </Row>
      <Row>
        <SubTitle>센터</SubTitle>
        {isEdit ? (
          <EditContents>
            <Select defaultValue={editData?.CENTER_ID}
              onChange={e => setEditData(
                prev => ({
                  ...prev, CENTER_ID: Number(e.target.value), 
                  CENTER_NAME: centerList?.find(x => x?.ID === Number(e.target.value))?.NAME
                })
              )}
            >
              {centerList?.map(item => (
                <option key={item?.ID} value={item?.ID}>{item?.NAME}</option>
              ))}
            </Select>
          </EditContents>
        ) : (
          <Contents>{data?.CENTER_NAME}</Contents>
        )}
      </Row>
      <Row>
        <SubTitle>소속기관</SubTitle>
        {isEdit ? (
          <EditContents>
            <TextInput defaultValue={editData?.SCHOOL_NAME} placeholder='소속기관'
              onChange={e => setEditData(prev => ({...prev, SCHOOL_NAME: e.target.value}))}
            />
          </EditContents>
        ) : (
          <Contents>{data?.SCHOOL_NAME}</Contents>
        )}
      </Row>
    </Wrap>
  )
}

const Wrap = Styled.section``;
const Row = Styled.div`
  margin-bottom: ${x => x?.margin ?? 10}px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  min-height: 34px;
  flex-wrap: ${x => x.col ? 'wrap' : 'unset'};
  &:last-of-type { margin-bottom: 0; }
`;
const SubTitle = Styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100px;
  min-width: 100px;
  text-indent: 8px;
  font-weight: 500;
  letter-spacing: 1px;
  border-left: 3px solid #00ada9;
`;
const Contents = Styled.div`
  word-break: keep-all;
`;
const EditContents = Styled.div`
  word-break: keep-all;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const TextInput = Styled.input`
  width: ${x => x.isNum ? '100' : ''}px;
  margin-right: 5px;
`;
const Select = Styled.select`
  width: ${x => x.isNum ? '100' : ''}px;
  margin-right: 5px;
`;
const RadioGroup = Styled.p`
  margin-right: 10px;
`;
const RadioInput = Styled.input`
  margin-right: 5px;
`;
const Label = Styled.label`
  tranform: translateY(-1px);
`;