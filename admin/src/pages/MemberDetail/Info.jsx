import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import Checkbox from '%/Checkbox';
import { FiCheck, FiEdit, FiX } from "react-icons/fi";

export default function 회원정보박스 ({ data, setData }) {
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(data);
  const [isFold, setIsFold] = useState(true);

  const validate = () => {
    if (editData?.NAME?.trim() === '') return useAlert.warn('알림', '이름을 적어주세요.');
    if (editData?.EMAIL?.trim() === '') return useAlert.warn('알림', '이메일을 적어주세요.');
    if (editData?.HEIGHT === '') return useAlert.warn('알림', '신장을 적어주세요.');
    if (editData?.WEIGHT === '') return useAlert.warn('알림', '체중을 적어주세요.');
    if (editData?.SCHOOL_NAME?.trim() === '') return useAlert.warn('알림', '소속 기관을 적어주세요.');
    save();
  }
  const save = () => {
    let send = { 
      ID: data?.ID, NAME: editData?.NAME, BIRTH: editData?.BIRTH,
      EMAIL: editData?.EMAIL, HEIGHT: editData?.HEIGHT, GENDER: editData?.GENDER,
      WEIGHT: editData?.WEIGHT, SCHOOL_NAME: editData?.SCHOOL_NAME,
    };
    useAxios.put('/memberModify', send).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('알림', data?.msg);
        return;
      }
      useAlert.success('알림', '저장되었습니다.');
      setIsEdit(false);
      setData(prev => ({ ...prev, ...send }));
    });
  }
  const dateKeyBlock = e => e.target.value = data?.BIRTH;
  const changeTestFlag = value => {
    let send = { flag: value, userId: data?.ID };
    useAxios.put('/changeTestFlag', send).then(({ data }) => {
      if (!data?.result) return useAlert.error('알림', data?.msg);
    });
  }
  const dateKoreaFormat = date => {
    let [y, m, d] = date?.split('-');
    return y + '년 ' + m + '월 ' + d + '일';
  }

  return (
    <>
    <Wrap>
      {isEdit ? (
        <>
          <SaveBtn title='저장' onClick={validate} />
          <CancelBtn title='취소' onClick={() => setIsEdit(false)} />
        </>
      ) : (
        <EditBtn title='수정' onClick={() => setIsEdit(true)} />
      )}
      {/* <FileInput type='file' id='memberProfileImage' /> */}
      <ProfileImage img={data?.IMG} htmlFor='memberProfileImage' />
      <RowWrap>
        <Row>
          <RowTitle>소속 센터</RowTitle>
          <RowContent>{data?.CENTER_NAME ?? '-'}</RowContent>
        </Row>
        <Row>
          <RowTitle>소속 기관</RowTitle>
          {isEdit ? (
            <RowContent>
              <Input defaultValue={data?.SCHOOL_NAME ?? ''}
                onChange={e => setEditData(prev => ({ ...prev, SCHOOL_NAME: e.target.value }))}
              />
            </RowContent>
          ) : (
            <RowContent>{data?.SCHOOL_NAME ?? '-'}</RowContent>
          )}
        </Row>
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
          <RowTitle>이메일</RowTitle>
          {isEdit ? (
            <RowContent>
              <Input defaultValue={data?.EMAIL ?? ''}
                onChange={e => setEditData(prev => ({ ...prev, EMAIL: e.target.value }))}
              />
            </RowContent>
          ) : (
            <RowContent>{data?.EMAIL ?? '-'}</RowContent>
          )}
        </Row>
        {!isFold && (
          <>
            <Row>
              <RowTitle>성별</RowTitle>
              {isEdit ? (
                <RowContent>
                  <Label>
                    <Radio type='radio' name='GENDER' value='M'
                      defaultChecked={data?.GENDER === 'M'}
                      onChange={e => setEditData(prev => ({ ...prev, GENDER: e.target.value }))}
                    />
                    남자
                  </Label>
                  <Label>
                    <Radio type='radio' name='GENDER' value='F'
                      defaultChecked={data?.GENDER === 'F'}
                      onChange={e => setEditData(prev => ({ ...prev, GENDER: e.target.value }))}
                    />
                    여자
                  </Label>
                </RowContent>
              ): (
                <RowContent>{data?.GENDER === 'M' ? '남자' : data?.GENDER === 'F' ? '여자' : '-'}</RowContent>
              )}
            </Row>
            <Row>
              <RowTitle>생년월일</RowTitle>
              {isEdit ? (
                <RowContent>
                  <Input type='date' defaultValue={data?.BIRTH ?? ''}
                    onKeyUp={dateKeyBlock}
                    onChange={e => setEditData(prev => ({ ...prev, BIRTH: e.target.value }))}
                  />
                </RowContent>
              ) : (
                <RowContent>{data?.BIRTH ? dateKoreaFormat(data?.BIRTH) : '-'}</RowContent>
              )}
            </Row>
            <Row>
              <RowTitle>신장</RowTitle>
              {isEdit ? (
                <RowContent>
                  <Input type='number' defaultValue={data?.HEIGHT ?? ''}
                    onChange={e => setEditData(prev => ({ ...prev, HEIGHT: e.target.value }))}
                  />
                </RowContent>
              ) : (
                <RowContent>{data?.HEIGHT ? data?.HEIGHT + 'Cm' : '-'}</RowContent>
              )}
            </Row>
            <Row>
              <RowTitle>체중</RowTitle>
              {isEdit ? (
                <RowContent>
                  <Input type='number' defaultValue={data?.WEIGHT ?? ''}
                    onChange={e => setEditData(prev => ({ ...prev, WEIGHT: e.target.value }))}
                  />
                </RowContent>
              ) : (
                <RowContent>{data?.WEIGHT ? data?.WEIGHT + 'Kg' : '-'}</RowContent>
              )}
            </Row>
            <Row>
              <RowTitle>가입 플랫폼</RowTitle>
              <RowContent>{data?.PLATFORM === 'kakao' ? '카카오' : data?.PLATFORM === 'naver' ? '네이버' : '-'}</RowContent>
            </Row>
            <Row>
              <RowTitle>가입일</RowTitle>
              <RowContent>
                {data?.DATE?.split(' ')[0] ? dateKoreaFormat(data?.DATE?.split(' ')[0]) : '-'}
              </RowContent>
            </Row>
            <Row>
              <RowTitle>최근 수정일</RowTitle>
              <RowContent>
                {data?.MODIFY_DATE?.split(' ')[0] ? dateKoreaFormat(data?.MODIFY_DATE?.split(' ')[0]) : '-'}
              </RowContent>
            </Row>
          </>
        )}
        <FoldBtn onClick={() => setIsFold(prev => !prev)}>
          {isFold ? '확장' : '가리기'}
        </FoldBtn>
      </RowWrap>
    </Wrap>
    <Wrap type='testFlag'>
      <Row style={{ padding: '0 10px', margin: 0 }}>
        <RowTitle>테스트 권한</RowTitle>
        <RowContent>
          <Checkbox 
            style={{ marginLeft: 0 }}
            checked={data?.TEST_FLAG} 
            onChange={value => changeTestFlag(value)}
          />
        </RowContent>
      </Row>
    </Wrap>
    </>
  )
}

const Wrap = Styled.section`
  background-color: #dbf1ef;
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
  flex: ${x => x?.type === 'testFlag' ? 'unset' : '1'};
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
const ProfileImage = Styled.label`
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
  position: relative;
  overflow: hidden;
  /* &::after {
    content: '파일선택';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000020;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    display: none;
  }
  &:hover::after {
    display: flex;
  } */
`;
const RowWrap = Styled.article`
  flex: 1;
  overflow: auto;
  padding: 5px 10px;
`;
const Row = Styled.div`
  padding: 5px 0;
  margin-bottom: 5px;
  font-size: 14px;
`;
const RowTitle = Styled.span`
  white-space: nowrap;
  width: 35%;
  min-width: 80px;
  font-weight: 500;
`;
const RowContent = Styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  word-break: break-all;
  font-size: 13px;
`;
const Input = Styled.input`
  width: 100%;
`;
const Label = Styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const Radio = Styled.input`
  margin-left: 2px;
  margin-right: 5px;
`;
const FoldBtn = Styled.button`
  width: 100%;
  height: 28px;
  line-height: 26px;
  font-size: 12px;
  margin-top: 10px;
`;
const FileInput = Styled.input`
  display: none;
`;