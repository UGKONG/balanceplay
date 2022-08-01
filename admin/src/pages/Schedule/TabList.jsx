import React, { useState, useRef, useEffect, useMemo } from 'react';
import Styled from 'styled-components';
import Loading from '@/pages/Common/Loading';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import useStore from '%/useStore';
import { FcCheckmark } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import { BsTrash, BsPencil } from 'react-icons/bs';
import TabItemModifyModal from './TabItemModifyModal';

export default function 탭리스트({
  initData,
  active,
  setActive,
  getCalendarInit,
}) {
  const dispatch = useStore((x) => x?.setState);
  const createCalendarInputRef = useRef(null);
  const createRoomInputRef = useRef(null);
  const [createNameValue, setCreateNameValue] = useState('');
  const [createCalendarType, setCreateCalendarType] = useState(1);
  const [isModifyModal, setIsModifyModal] = useState(null);

  const isActiveAll = useMemo(() => {
    let tab = active?.tab;
    if (tab === 1 && active?.calendar === 0) return true;
    if (tab === 2 && active?.room === 0) return true;
    if (tab === 3 && active?.teacher === 0) return true;
    return false;
  }, [active]);

  const itemAllClick = () => {
    let tab = active?.tab;
    if (tab === 1) return setActive((prev) => ({ ...prev, calendar: 0 }));
    if (tab === 2) return setActive((prev) => ({ ...prev, room: 0 }));
    if (tab === 3) return setActive((prev) => ({ ...prev, teacher: 0 }));
  };

  const calendarDelete = (id, type) => {
    dispatch('confirmInfo', {
      mainTitle: '해당 캘린더를 삭제하시겠습니까?',
      subTitle:
        type === 1
          ? '예약된 수업이 존재하면 삭제할 수 없습니다.'
          : '모든 일정이 삭제됩니다.',
      yesFn: () => {
        useAxios.delete('/calendar/' + id).then(({ data }) => {
          if (!data?.result) return useAlert.error('알림', data?.msg);
          useAlert.success('알림', '삭제되었습니다.');
          getCalendarInit();
          if (active?.calendar === id) {
            setActive((prev) => ({ ...prev, calendar: 0 }));
          }
        });
      },
    });
  };

  const roomDelete = (id) => {
    dispatch('confirmInfo', {
      mainTitle: '해당 룸을 삭제하시겠습니까?',
      subTitle: '수업에 지정된 룸은 삭제할 수 없습니다.',
      yesFn: () => {
        useAxios.delete('/room/' + id).then(({ data }) => {
          if (!data?.result) return useAlert.error('알림', data?.msg);
          useAlert.success('알림', '삭제되었습니다.');
          getCalendarInit();
          if (active?.room === id) {
            setActive((prev) => ({ ...prev, room: 0 }));
          }
        });
      },
    });
  };

  const itemDelete = (id, calendarType) => {
    let type = active?.tab;

    if (type === 1) calendarDelete(id, calendarType);
    if (type === 2) roomDelete(id);
  };

  const createNo = () => {
    setCreateCalendarType(1);
    setCreateNameValue('');
  };

  const createOk = () => {
    let tabName = active?.tab === 1 ? '캘린더' : '방';
    let ref = active?.tab === 1 ? createCalendarInputRef : createRoomInputRef;
    if (!createNameValue) {
      useAlert.warn('알림', tabName + ' 이름을 적어주세요.');
      ref?.current?.focus();
      return;
    }

    if (active?.tab === 1) {
      useAxios
        .post('/calendar', {
          TYPE: createCalendarType,
          NAME: createNameValue,
        })
        .then(({ data }) => {
          if (!data?.result) return useAlert?.error(data?.msg);
          useAlert?.success('알림', '생성되었습니다.');
          createNo();
          getCalendarInit();
        });
    }

    if (active?.tab === 2) {
      useAxios
        .post('/room', {
          NAME: createNameValue,
        })
        .then(({ data }) => {
          if (!data?.result) return useAlert?.error(data?.msg);
          useAlert?.success('알림', '생성되었습니다.');
          createNo();
          getCalendarInit();
        });
    }
  };

  useEffect(createNo, [active?.tab]);

  return (
    <Container>
      {Object.keys(initData)?.length === 0 ? (
        <Loading />
      ) : (
        <>
          {/* 탭 리스트 */}
          <TabList>
            {(initData?.tab ?? [])?.map((item) => (
              <TabItem
                key={item?.ID}
                className={active?.tab === item?.ID ? 'active' : ''}
                onClick={() =>
                  setActive((prev) => ({ ...prev, tab: item?.ID }))
                }
              >
                {item?.NAME}
              </TabItem>
            ))}
          </TabList>

          <TabItemList>
            {/* 전체 */}
            <Item
              className={isActiveAll ? 'active' : 'all'}
              onClick={itemAllClick}
              data-all="true"
            >
              <span>전 체</span>
            </Item>

            {/* 캘린더 리스트 */}
            {active?.tab === 1 && (
              <>
                {(initData?.calendar ?? [])?.map((item) => (
                  <CalendarItem
                    key={item?.ID}
                    className={active?.calendar === item?.ID ? 'active' : ''}
                  >
                    <span
                      onClick={() =>
                        setActive((prev) => ({ ...prev, calendar: item?.ID }))
                      }
                    >
                      {item?.NAME}
                    </span>
                    <ModifyIcon
                      onClick={() => setIsModifyModal({ tab: 1, info: item })}
                    />
                    <DelIcon onClick={() => itemDelete(item?.ID, item?.TYPE)} />
                  </CalendarItem>
                ))}
                <CreateItem tab={1}>
                  <p>
                    <CreateRadio
                      id="calendarType1"
                      checked={createCalendarType === 1}
                      onChange={(e) =>
                        setCreateCalendarType(e?.target?.checked ? 1 : 2)
                      }
                    />
                    <CreateRadioLabel htmlFor="calendarType1">
                      수업
                    </CreateRadioLabel>
                    <CreateRadio
                      id="calendarType2"
                      checked={createCalendarType === 2}
                      onChange={(e) =>
                        setCreateCalendarType(e?.target?.checked ? 2 : 1)
                      }
                    />
                    <CreateRadioLabel htmlFor="calendarType2">
                      일정
                    </CreateRadioLabel>
                  </p>
                  <CreateInput
                    tab={active?.tab}
                    value={createNameValue}
                    ref={createCalendarInputRef}
                    onChange={(e) => setCreateNameValue(e?.target?.value)}
                  />
                  <OkIcon onClick={createOk} />
                  <NoIcon onClick={createNo} />
                </CreateItem>
              </>
            )}

            {/* 방 리스트 */}
            {active?.tab === 2 && (
              <>
                {(initData?.room ?? [])?.map((item) => (
                  <RoomItem
                    key={item?.ID}
                    className={active?.room === item?.ID ? 'active' : ''}
                  >
                    <span
                      onClick={() =>
                        setActive((prev) => ({ ...prev, room: item?.ID }))
                      }
                    >
                      {item?.NAME}
                    </span>
                    <ModifyIcon
                      onClick={() => setIsModifyModal({ tab: 2, info: item })}
                    />
                    <DelIcon onClick={() => itemDelete(item?.ID)} />
                  </RoomItem>
                ))}
                <CreateItem tab={2}>
                  <CreateInput
                    tab={active?.tab}
                    value={createNameValue}
                    ref={createRoomInputRef}
                    onChange={(e) => setCreateNameValue(e?.target?.value)}
                  />
                  <OkIcon onClick={createOk} />
                  <NoIcon onClick={createNo} />
                </CreateItem>
              </>
            )}

            {/* 선생님 리스트 */}
            {active?.tab === 3 &&
              (initData?.teacher ?? [])?.map((item) => (
                <TeacherItem
                  key={item?.ID}
                  className={active?.teacher === item?.ID ? 'active' : ''}
                  onClick={() =>
                    setActive((prev) => ({ ...prev, teacher: item?.ID }))
                  }
                >
                  <span>{item?.NAME}</span>
                </TeacherItem>
              ))}
          </TabItemList>
        </>
      )}

      {isModifyModal && (
        <TabItemModifyModal
          getCalendarInit={getCalendarInit}
          isModifyModal={isModifyModal}
          setIsModifyModal={setIsModifyModal}
        />
      )}
    </Container>
  );
}

const Container = Styled.article`
  width: 200px;
  height: 100%;
  border: 2px solid #b9e1dc;
  border-radius: 10px;
  transition: .2s width;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 800px) {
    width: 160px;
  }
`;
const TabList = Styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #b9e1dc;
`;
const TabItem = Styled.li`
  flex: 1;
  font-size: 13px;
  padding: 8px 0;
  text-align: center;
  border-right: 1px solid #b9e1dc;
  cursor: pointer;
  &:last-of-type {
    border-right: none;
  }
  &.active {
    color: #fff;
    background-color: #00ada9;
  }
`;
const TabItemList = Styled.ul`
  flex: 1;
  overflow: auto;
  padding: 0 6px 6px;
  margin-top: 6px;
`;
const Item = Styled.li`
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 400;
  border: 1px solid #c9ebe7;
  letter-spacing: 1px;
  position: relative;
  border-radius: 3px;
  color: #666;
  transition: .1s;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: #444;
  }

  & > span {
    cursor: pointer;
    display: block;
    width: 100%;
    min-width: calc(100% - 54px);
    max-width: calc(100% - 54px);
    line-height: 33px;
    height: 33px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 5px 0 10px;
  }
  &[data-all="true"] {
    color: #444;
    font-weight: 500;
    text-align: center;
    border: 1px solid #aee7e0;
    &:hover {
      color: #222;
    }
    & > span {
      max-width: 100%;
      padding: 0 5px;
    }
    &.active > span {
      max-width: 100%;
      padding: 0;
    }
  }
  &.active {
    color: #111;
    font-weight: 500;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background-color: #00ada9;
    }
    & > span {
      padding: 0 5px 0 16px;
    }
  }

`;
const CalendarItem = Styled(Item)``;
const RoomItem = Styled(Item)``;
const TeacherItem = Styled(Item)``;
const CreateItem = Styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 2px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 3px;
  opacity: .6;
  position: relative;
  overflow: hidden;

  &:focus, &:hover {
    opacity: 1;
  }
  &:hover::after {
    top: -100%;
    opacity: 0;
  }
  &::after {
    content: '생성';
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #f1f9f8;
    color: #666;
    opacity: 1;
    transition: .3s;
  }
  & > p {
    width: 100%;
    padding: 4px 2px 2px;
    display: ${(x) => (x?.tab === 1 ? 'flex' : 'none')};
    align-items: center;
  }
`;
const CreateRadio = Styled.input.attrs(() => ({
  type: 'radio',
  name: 'calendarType',
}))`

`;
const CreateRadioLabel = Styled.label`
  margin-left: 2px;
  margin-right: 5px;
`;
const CreateInput = Styled.input.attrs(({ tab }) => ({
  type: 'text',
  placeholder: (tab === 1 ? '캘린더' : '방') + ' 이름',
}))`
  width: calc(100% - 22px * 2 - 3px);
  margin: 2px 3px 2px 0;
`;
const DelIcon = Styled(BsTrash)`
  color: #bbb;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  max-width: 18px;
  max-height: 18px;
  margin: 0 4px;
  cursor: pointer;

  &:hover {
    color: #f00;
  }
`;
const ModifyIcon = Styled(BsPencil)`
  color: #bbb;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  max-width: 18px;
  max-height: 18px;
  margin: 0 4px;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;
const OkIcon = Styled(FcCheckmark)`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  max-width: 20px;
  max-height: 20px;
  margin-right: 2px;
  cursor: pointer;
  color: #89c48e;
  &:hover {
    color #458f4a;
  }
`;
const NoIcon = Styled(IoMdClose)`
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  max-width: 20px;
  max-height: 20px;
  margin-right: 2px;
  cursor: pointer;
  color: #777;
  &:hover {
    color: #333;
  }
`;
