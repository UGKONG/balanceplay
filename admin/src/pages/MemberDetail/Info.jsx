import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import { FiCheck, FiEdit, FiX } from "react-icons/fi";

export default function 회원정보박스 ({ data }) {
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(data);

  const save = () => {
    useAlert.success('알림', '저장되었습니다.');
    setIsEdit(false);
  }

  return (
    <Wrap>
      {isEdit ? (
        <>
          <SaveBtn title='저장' onClick={save} />
          <CancelBtn title='취소' onClick={() => setIsEdit(false)} />
        </>
      ) : (
        <EditBtn title='수정' onClick={() => setIsEdit(true)} />
      )}
      <ProfileImage img={data?.IMG} />
      <RowWrap>
        <Row>
          <RowTitle>이름</RowTitle>
          {isEdit ? (
            <RowContent>
              <Input defaultValue={data?.NAME ?? ''}
                onChange={e => setEditData(prev => ({ ...prev, NAME: e.target.value }))}
              />
            </RowContent>
          ) : (
            <RowContent>{data?.NAME ?? '-'}</RowContent>
          )}
        </Row>
        <Row>
          <RowTitle>성별</RowTitle>
          <RowContent>{data?.GENDER === 'M' ? '남자' : data?.GENDER === 'F' ? '여자' : '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>소속센터</RowTitle>
          <RowContent>{data?.CENTER_NAME ?? '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>이메일</RowTitle>
          <RowContent>{data?.EMAIL ?? '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>생년월일</RowTitle>
          <RowContent>{data?.BIRTH ?? '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>신장</RowTitle>
          <RowContent>{data?.HEIGHT ?? '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>체중</RowTitle>
          <RowContent>{data?.WEIGHT ?? '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>가입 플랫폼</RowTitle>
          <RowContent>{data?.PLATFORM === 'kakao' ? '카카오' : data?.PLATFORM === 'naver' ? '네이버' : '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>소속기관</RowTitle>
          <RowContent>{data?.SCHOOL_NAME ?? '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>테스트 권한</RowTitle>
          <RowContent>{data?.TEST_FLAG === 1 ? '예' : '아니요'}</RowContent>
        </Row>
        <Row>
          <RowTitle>가입일</RowTitle>
          <RowContent>{data?.DATE?.split(' ')[0] ?? '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>최근 수정일</RowTitle>
          <RowContent>{data?.MODIFY_DATE?.split(' ')[0] ?? '-'}</RowContent>
        </Row>
      </RowWrap>
    </Wrap>
  )
}

const Wrap = Styled.section`
  background-color: #dbf1ef;
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
  flex: 1;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const EditBtn = Styled(FiEdit)`
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: .5;
  cursor: pointer;
  padding: 5px;
  font-size: 30px;
  &:hover {
    opacity: .7;
  }
`;
const SaveBtn = Styled(FiCheck)`
  position: absolute;
  top: 10px;
  right: 40px;
  opacity: .5;
  cursor: pointer;
  padding: 5px;
  font-size: 30px;
  &:hover {
    opacity: .7;
  }
`;
const CancelBtn = Styled(FiX)`
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: .5;
  cursor: pointer;
  padding: 5px;
  font-size: 30px;
  &:hover {
    opacity: .7;
  }
`;
const ProfileImage = Styled.div`
  margin: 10px auto 20px;
  background-image: url(${x => x?.img});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  border: 2px solid #f1f9f8;
  border-radius: 50%;
  width: 140px;
  height: 140px;
  box-shadow: 0 3px 6px #00000040;
`;
const RowWrap = Styled.article`
  flex: 1;
  overflow: auto;
  padding: 0 10px;
  ::-webkit-scrollbar {
    width: 5px;
    background-color: #dbf1ef;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #c9ebe7;
    &:hover {
      background-color: #a8d4cf;
    }
  }
`;
const Row = Styled.div`
  padding: 5px 0;
  font-size: 14px;
`;
const RowTitle = Styled.span`
  white-space: nowrap;
  width: 38%;
  min-width: 80px;
  font-weight: 500;
`;
const RowContent = Styled.span`
  flex: 1;
`;
const Input = Styled.input`
  width: 100%;
`;
