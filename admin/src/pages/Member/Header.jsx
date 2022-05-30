import React, { useState, useRef, useEffect } from 'react';
import Styled from 'styled-components';
import { AiOutlineSearch } from "react-icons/ai";
import useAlert from '%/useAlert';
import useAxios from '%/useAxios';
import useStore from '%/useStore';
import Filter from './Filter';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function 회원해더 ({ list, getList, setList, checkList, searchText, setSearchText }) {
  const filtering = useStore(x => x?.temp);
  const [isReset, setIsReset] = useState(false);

  // 엑셀 URL 생성
  const makeExcel = data => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('회원리스트');
    worksheet.columns = [
      {header: '회원코드', key: 'ID'},
      {header: '이름', key: 'NAME'},
      {header: '이메일', key: 'EMAIL'},
      {header: '플랫폼 아이디', key: 'AUTH_ID'},
      {header: '플랫폼', key: 'PLATFORM'},
      {header: '센터코드', key: 'CENTER_ID'},
      {header: '센터이름', key: 'CENTER_NAME'},
      {header: '생년월일', key: 'BIRTH'},
      {header: '소속기관', key: 'SCHOOL_NAME'},
      {header: '성별', key: 'GENDER'},
      {header: '신장', key: 'HEIGHT'},
      {header: '체중', key: 'WEIGHT'},
      {header: '프로필이미지', key: 'IMG'},
      {header: '테스트권한', key: 'TEST_FLAG'},
      {header: '삭제여부', key: 'IS_DELETE'},
      {header: '생성일자', key: 'DATE'},
      {header: '수정일자', key: 'MODIFY_DATE'},
    ];
    data?.map((item, idx) => worksheet.addRow(item));

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "회원리스트.xlsx");
    });
  }
  // 회원 리스트 조회
  const memberListDownload = () => {
    let ask = confirm('회원리스트를 엑셀파일로 다운받으시겠습니까?');
    if (!ask) return;
    
    useAxios.get('/memberListDownload').then(({ data }) => {
      if (!data?.result || !data?.data) return useAlert.error('알림', '엑셀파일을 다운받을 수 없습니다.');
      console.log(data?.data);
      makeExcel(data?.data);
    })
  }

  const searchReset = () => {
    setSearchText('');
    getList('');
    setIsReset(prev => !prev);
  }
  
  const memberDelete = () => {
    let ask = confirm('선택된 ' + checkList?.length + '명의 회원을 삭제하시겠습니까?');
    if (!ask) return;
    let idArr = checkList?.map(x => x.ID);
    
    useAxios.delete('/member', { data: { idArr } }).then(({ data }) => {
      if (!data?.result) {
        useAlert.error('회원삭제', checkList?.length + '명의 회원이 삭제되지 않았습니다.');
        return;
      }
      useAlert.success('회원삭제', checkList?.length + '명의 회원이 삭제되었습니다.');
      getList();
    });
  }

  return (
    <Wrap>
      <Left>
        <Search>
          <Input placeholder='검색어 입력'
            value={searchText} 
            onChange={e => setSearchText(e.target.value)} 
            onKeyDown={e => e.keyCode === 13 && getList()}
          />
          <SearchBtn onClick={getList} />
        </Search>
        <Filter getList={getList} setList={setList} isReset={isReset} />
        {(searchText !== '' || filtering) && (
          <SearchResetBtn onClick={searchReset}>초기화</SearchResetBtn>
        )}
      </Left>
      <Right>
        <MemberListDownloadBtn onClick={memberListDownload}>회원 리스트 다운로드</MemberListDownloadBtn>
        <Count>
          <span>전체 {list?.length ?? 0}개</span>
          <span>선택 {checkList?.length ?? 0}개</span>
        </Count>
        {checkList?.length !== 0 && <DeleteBtn onClick={memberDelete}>선택 삭제</DeleteBtn>}
      </Right>
    </Wrap>
  )
}

const Wrap = Styled.section`
  position: relative;
`;
const Left = Styled.div``;
const Right = Styled.div``;
const Search = Styled.div`
  position: relative;
`;
const Input = Styled.input`
  width: 20vw;
  min-width: 160px;
  max-width: 360px;
  height: 32px !important;
`;
const SearchBtn = Styled(AiOutlineSearch)`
  width: 32px;
  height: 32px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  color: #777;
  padding: 6px;
  cursor: pointer;
`;
const SearchResetBtn = Styled.button`
  margin-left: 10px;
`;
const Count = Styled.div`
  margin-left: 16px;
  font-size: 12px;
  color: #555;
  align-self: stretch;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px 2px 6px;
    border-left: 3px solid #00ada9;
  }
`;
const DeleteBtn = Styled.button`
  border: 1px solid #ff4f4f !important;
  background-color: #ee6d6d !important;
  &:hover {
    background-color: #ec6565 !important;
  }
  &:focus {
    box-shadow: 0 0 0 4px rgb(238 109 109 / 25%) !important;
  }
`;
const MemberListDownloadBtn = Styled.button`
`;