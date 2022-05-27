import React, { useMemo } from 'react';
import Styled from 'styled-components';

export default function 밸런스플레이정보 ({ Style }) {
  const data = useMemo(() => [
    { title: '상호', contents: '밸런스플레이', size: null },
    { title: '대표', contents: '김승호', size: null },
    { title: '주소', contents: '경기 용인시 처인구 명지로40번길 15-17 404호', size: 13 },
    { title: '연락처', contents: '031-335-3244', size: null },
    { title: '홈페이지', contents: '<a href="http://balanceplay.co.kr" target="_blank">balanceplay.co.kr</a>', size: null },
  ], []);

  return (
    <Style.Wrap>
      {/* 정보 */}
      {data?.length > 0 && data?.map((item, i) => (
        <Style.Row key={i}>
          {item?.title && <Style.SubTitle>{item?.title}</Style.SubTitle>}
          <Style.Contents
            style={{ fontSize: item?.size ?? 'auto' }}
            dangerouslySetInnerHTML={{ __html: item?.contents }}
          />
        </Style.Row>
      ))}
    </Style.Wrap>
  )
}

const Wrap = Styled.section`

`;