import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';
import Checkbox from '%/Checkbox';
import useStore from '%/useStore';
import useDate from '%/useDate';

export default function 가족정보 ({ data, getData, activeFamily, isCreate, setIsCreate }) {
  
  const defaultData = {
    NAME: '',
    TYPE: '',
    BIRTH: '',
    IS_TOGETHER: 0,
    DESCRIPTION: ''
  }
  
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({...data});
  const userId = useStore(x => x.isLogin)?.ID;
  const familyTypeList = useRef([
    '할아버지', '할머니', '아버지', '어머니', '형', 
    '누나', '남동생', '언니', '오빠', '여동생', '기타'
  ]);

  const createSubmit = () => {
    useAxios.post('/myFamilyInfo/' + userId, editData).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('가족정보', data?.msg);
        return;
      }
      useAlert.success('가족정보', '정보를 등록하였습니다.');
      setIsEdit(false);
      setIsCreate(false);
      getData();
    })
  }

  const editSubmit = () => {

    if (!editData?.ID) return createSubmit();

    useAxios.put('/myFamilyInfo', editData).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('가족정보', data?.msg);
        return;
      }
      useAlert.success('가족정보', '정보를 수정하였습니다.');
      setIsEdit(false);
      getData();
    })
  }
  const editValidator = () => {
    if (isCreate && !editData?.TYPE) {
      useAlert.warn('가족정보' , '유형을 선택해주세요.');
      return;
    }
    if (editData?.NAME?.length === 0) {
      useAlert.warn('가족정보' , '이름을 입력해주세요.');
      return;
    }
    if (String(editData?.BIRTH)?.length !== 10) {
      useAlert.warn('가족정보' , '생년월일을 정확히 입력해주세요.');
      return;
    }
    editData.NAME = editData?.NAME?.trim();
    editSubmit();
  }
  // 추가 버튼 클릭
  const createBtnClick = () => {
    if (!userId || userId == 1) return useAlert.info('구성원 추가', '둘러보기 계정은 구성원 추가가 불가능합니다.');
    setIsEdit(true);
    setIsCreate(true);
    setEditData({...defaultData});
  }
  // 수정 버튼 클릭
  const edit = () => {
    if (!userId || userId == 1) return useAlert.info('구성원 수정', '둘러보기 계정은 구성원 수정이 불가능합니다.');
    if (!isEdit) {
      setIsEdit(true);
      return;
    }
    editValidator();
  }
  // 삭제 버튼 클릭
  const del = () => {
    if (!userId || userId == 1) return useAlert.info('구성원 삭제', '둘러보기 계정은 구성원 삭제가 불가능합니다.');
    let ask = confirm(data?.TYPE + ' 정보를 삭제하시겠습니까?');
    if (!ask) return;

    useAxios.delete('/myFamilyInfo/' + editData?.ID).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('가족정보 삭제', data?.msg);
        return;
      }
      useAlert.success('가족정보 삭제', '정보를 삭제하였습니다.');
      getData();
    })
  }

  // 생년월일 변경
  const dateChange = e => {
    let val = e.target.value;
    if (val?.length !== 10) return;

    let now = new Date();
    let cho = new Date(val);
    
    now.setHours(0);now.setMinutes(0);now.setSeconds(0);now.setMilliseconds(0);
    cho.setHours(0);cho.setMinutes(0);cho.setSeconds(0);cho.setMilliseconds(0);

    if (now - cho < 0) {
      useAlert.warn('가족 구성원 추가', '이전날짜를 선택해주세요.');
      let date = useDate(now, 'date');
      setEditData(prev => ({ ...prev, BIRTH: date }));
      return;
    }

    setEditData(prev => ({ ...prev,  BIRTH: val }));
  }

  const activeFamilyChange = () => {
    setIsCreate(data ? false : true);
    setIsEdit(data ? false : true);
    setEditData(data ?? {...defaultData});
  }

  const cancel = () => {
    setEditData(data);
    setIsCreate(false);
    setIsEdit(false);
  }

  useEffect(activeFamilyChange, [activeFamily, data]);

  return (
    <Wrap>
      <Header>
        <Title>{isCreate ? '가족 구성원 추가' : data?.TYPE + ' 정보'}</Title>
        <OptionBtnWrap>
          {!isCreate && !isEdit && <OptionBtn mode='create' onClick={createBtnClick}>구성원 추가</OptionBtn>}
          <OptionBtn mode='edit' onClick={edit}>{isEdit || isCreate ? '저장' : '수정'}</OptionBtn>
          {!isEdit && !isCreate && <OptionBtn mode='del' onClick={del}>삭제</OptionBtn>}
          {data && (isEdit || isCreate) && <OptionBtn mode='cancel' onClick={cancel}>취소</OptionBtn>}
        </OptionBtnWrap>  
      </Header>
      <Info>
        {isCreate && (
          <Row>
            <SubTitle>유형</SubTitle>
            <EditContents>
              <Select onChange={e => setEditData(prev => ({...prev, TYPE: e.target.value}))}>
                <option value=''>유형 선택</option>
                {familyTypeList.current?.length > 0 && familyTypeList.current?.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </Select>
            </EditContents>
          </Row>
        )}
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
          <SubTitle>생년월일</SubTitle>
          {isEdit ? (
            <EditContents>
              <TextInput type='date' value={editData?.BIRTH} placeholder='생년월일' 
                onChange={dateChange}
              />
            </EditContents>
          ) : (
            <Contents>
              {data?.BIRTH?.split('-')[0]}년  {data?.BIRTH?.split('-')[1]}월  {data?.BIRTH?.split('-')[2]}일 
            </Contents>
          )}
        </Row>
        <Row>
          <SubTitle>동거여부</SubTitle>
          {isEdit ? (
            <EditContents>
              <Checkbox checked={editData?.IS_TOGETHER === 0 ? false : true} 
                style={{ marginLeft: -1 }}
                onChange={e => setEditData(prev => ({...prev, IS_TOGETHER: e ? 1 : 0}))}
              />
            </EditContents>
          ) : (
            <Contents>{data?.IS_TOGETHER === 0 ? '미동거' : '동거중'}</Contents>
          )}
        </Row>
        <Row col={true}>
          <SubTitle>설명</SubTitle>
          {isEdit ? (
              <Textarea defaultValue={editData?.DESCRIPTION} placeholder='선택입력' isNum={true}
                onChange={e => setEditData(prev => ({...prev, DESCRIPTION: e.target.value}))}
              />
          ) : (
            <Description>{data?.DESCRIPTION || '설명이 없습니다.'}</Description>
          )}
        </Row>
      </Info>
    </Wrap>
  )
}

const Wrap = Styled.article`
  padding: 10px 2px;
`;
const Header = Styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const Title = Styled.h3`
  font-size: 15px;
  font-weight: 500;  
`;
const Info = Styled.div``;
const OptionBtnWrap = Styled.div``;
const OptionBtn = Styled.button`
  margin-left: 6px;
  font-size: 12px;
  padding: 0px 12px;
  height: 28px;
  line-height: 26px;
  background-color: ${x => x.mode === 'edit' ? '#369cae' : x.mode === 'cancel' ? '#999' : x.mode === 'create' ? '#0076ad' : '#f06363'} !important;
  border: none;
  &:focus {
    box-shadow: none !important;
  }
`;
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
const Description = Styled.p`
  font-size: 14px;
  width: 100%;
  padding: 5px 11px;
`;
const EditContents = Styled.div`
  word-break: keep-all;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const Select = Styled.select`
  width: 150px;
`;
const TextInput = Styled.input`
  width: ${x => x.isNum ? 100 : 150}px;
  margin-right: 5px;
`;
const Textarea = Styled.textarea`
  width: 100%;
  margin-top: 10px;
`;
const Ext = Styled.span`
  font-size: 12px;
  color: #333;
  margin-left: 3px;
`;