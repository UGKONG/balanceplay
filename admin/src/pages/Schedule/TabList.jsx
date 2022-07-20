import React, { useMemo } from 'react';
import Styled from 'styled-components';
import Loading from '@/pages/Common/Loading';

export default function 탭리스트({ initData, active, setActive }) {
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
            >
              전 체
            </Item>

            {/* 캘린더 리스트 */}
            {active?.tab === 1 &&
              (initData?.calendar ?? [])?.map((item) => (
                <CalendarItem
                  key={item?.ID}
                  className={active?.calendar === item?.ID ? 'active' : ''}
                  onClick={() =>
                    setActive((prev) => ({ ...prev, calendar: item?.ID }))
                  }
                >
                  {item?.NAME}
                </CalendarItem>
              ))}

            {/* 방 리스트 */}
            {active?.tab === 2 &&
              (initData?.room ?? [])?.map((item) => (
                <RoomItem
                  key={item?.ID}
                  className={active?.room === item?.ID ? 'active' : ''}
                  onClick={() =>
                    setActive((prev) => ({ ...prev, room: item?.ID }))
                  }
                >
                  {item?.NAME}
                </RoomItem>
              ))}

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
                  {item?.NAME}
                </TeacherItem>
              ))}
          </TabItemList>
        </>
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
  text-align: center;
  padding: 6px 0;
  font-size: 13px;
  border: 1px solid #c9ebe7;
  letter-spacing: 1px;
  cursor: pointer;
  &.all {
    border: 2px solid #c9ebe7;
  }
  &.active {
    color: #fff;
    background-color: #00ada9;
  }
`;
const CalendarItem = Styled(Item)`
  
`;
const RoomItem = Styled(Item)`
  
`;
const TeacherItem = Styled(Item)`
  
`;
