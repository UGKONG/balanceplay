import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import PageAnimate from '%/PageAnimate';
import useStore from '%/useStore';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import FamilyTabLi from './FamilyTabLi';
import FamilyInfo from './FamilyInfo';
import MyInfo from './MyInfo';

export default function 나의정보페이지 () {
  const dispatch = useStore(x => x.setState);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeFamily, setActiveFamily] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isCreate, setIsCreate] = useState(false);

  const getData = () => {
    useAxios.get('/myInfo').then(({ data }) => {
      if (!data?.result) return useAlert.error('내정보', data?.msg);
      if (!data?.data) return setData(null);

      setData(data?.data);
      setIsEdit(false);
      setEditData(data?.data?.info);
      if (data?.data?.family?.length > 0) setActiveFamily(data?.data?.family[0]?.ID);
    })
  }
  const joinDataViewBtn = () => {
    navigate('/myJoinData/', {
      state: { data: data?.joinData }
    })
  }
  const familyData = useCallback(id => {
    return data?.family?.find(x => x?.ID === id);
  }, [data, activeFamily]);
  // 수정 처리
  const editSubmit = () => {
    useAxios.put('/myinfo', editData).then(({ data }) => {
      if (!data?.result || !data?.data) {
        useAlert.error('정보 수정', data?.msg);
        return;
      }
      useAlert.success('정보 수정', '정보를 수정하였습니다.');
      setIsEdit(false);
      dispatch('isLogin', data?.data);
    })
  }
  // 수정 유효성검사
  const editValidator = () => {
    if (String(editData?.NAME)?.trim() === '') {
      useAlert.warn('내정보' , '이름을 입력해주세요.');
      return;
    }
    if (String(editData?.HEIGHT)?.search(/[a-zA-Zㄱ-ㅎㅏ-ㅣ-가-힣\s]/gi) > -1) {
      useAlert.warn('내정보' , '신장을 숫자로만 입력해주세요.');
      return;
    }
    if (String(editData?.WEIGHT)?.search(/[a-zA-Zㄱ-ㅎㅏ-ㅣ-가-힣\s]/gi) > -1) {
      useAlert.warn('내정보' , '체중을 숫자로만 입력해주세요.');
      return;
    }
    if (String(editData?.SCHOOL_NAME)?.trim() === '') {
      useAlert.warn('내정보' , '소속기관을 입력해주세요.');
      return;
    }
    editData.HEIGHT = Number(editData?.HEIGHT);
    editData.WEIGHT = Number(editData?.WEIGHT);
    editSubmit();
  }
  // 수정 버튼 클릭
  const edit = () => {
    if (!data?.info?.ID || data?.info?.ID == 1) return useAlert.info('정보수정', '둘러보기 계정은 수정이 불가능합니다.');
    if (!isEdit) return setIsEdit(prev => !prev);
    editValidator();
  }
  // 탈퇴 버튼 클릭
  const joinOut = () => {
    if (!data?.info?.ID || data?.info?.ID == 1) return useAlert.info('회원탈퇴', '둘러보기 계정은 탈퇴가 불가능합니다.');
    let ask = confirm('탈퇴하시면 밸런스 플레이 이용을 하실 수 없습니다.\n정말 탈퇴 하시겠습니까?');
    if (!ask) return;
    alert('밸런스 플레이 정책에 따라 탈퇴 후 개인정보는 삭제됩니다.');

    useAxios.delete('/myInfo/' + data?.info?.ID).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('회원탈퇴', data?.msg);
        return;
      }
      
      useAlert.info('회원탈퇴' , '회원탈퇴가 완료되었습니다.');
      logout();
    });
  }
  // 로그아웃
  const logout = () => {
    useAxios.get('/logout').then(({ data }) => {
      dispatch('isLogin', null);
      navigate('/login');
    });
  }
  // 수정 취소
  const editCancel = () => {
    setEditData({...data?.info});
    setIsEdit(false);
  }

  useEffect(getData, []);

  return (
    <PageAnimate name='slide-up'>
      <Header>
        <Title>내정보</Title>
        <JoinDataViewBtn onClick={joinDataViewBtn}>초기면접지 보기</JoinDataViewBtn>
      </Header>

      <MyInfo data={data?.info} isEdit={isEdit} editData={editData} setEditData={setEditData} />

      <Option>
        <OptionBtn mode='edit' onClick={edit}>
          {isEdit ? '저 장' : '정보수정'}
        </OptionBtn>
        {isEdit ? <OptionBtn onClick={editCancel}>취 소</OptionBtn> : <OptionBtn onClick={joinOut}>회원탈퇴</OptionBtn>}
      </Option>

      {data?.family?.length > 0 && (
        <FamilyData>
          <FamilyTabWrap>
            {data?.family?.map(item => (
              <FamilyTabLi key={item?.ID} 
                item={item} 
                active={activeFamily} 
                setActive={setActiveFamily} 
              />
            ))}
            <FamilyTabLi />
          </FamilyTabWrap>
        </FamilyData>
      )}

      <FamilyInfo 
        data={familyData(activeFamily)} 
        getData={getData} 
        activeFamily={activeFamily} 
        isCreate={isCreate}
        setIsCreate={setIsCreate}
      />
    </PageAnimate>
  )
}

const Header = Styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
`;
const Title = Styled.h2`
  padding-bottom: 0 !important;
`;
const JoinDataViewBtn = Styled.button``;
const Option = Styled.section`
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
`;
const OptionBtn = Styled.button`
  margin-left: 6px;
  font-size: 12px;
  padding: 0 8px;
  height: 26px;
  line-height: 24px;
  background-color: ${x => x.mode === 'edit' ? '#369cae' : '#999'} !important;
  border: none;
  &:focus {
    box-shadow: none !important;
  }
`;
const FamilyData = Styled.section`

`;
const FamilyTabWrap = Styled.ul`
  padding: 6px 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  ::-webkit-scrollbar {
    height: 3px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }
`;