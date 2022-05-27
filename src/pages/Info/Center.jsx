import React, { useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';

export default function 센터정보 ({ Style }) {
  const [_data, _setData] = useState(null);

  const address = useMemo(() => {
    let total = [_data?.ADDRESS1, _data?.ADDRESS2, _data?.ADDRESS3];
    if (total?.join('') === '') return '-';
    return total?.join(' ');
  }, [_data]);

  const sns = useMemo(() => {
    let _sns = _data?.SNS;
    if (!_sns) return '-';
    return `<a href="${_sns}" target="_blank">${_sns}</a>`;
  }, [_data]);

  const data = useMemo(() => [
    { title: '센터명', contents: _data?.NAME || '-', size: null },
    { title: '센터 연락처', contents: _data?.CENTER_PHONE || '-', size: null },
    { title: '센터장', contents: _data?.MASTER_NAME || '-', size: null },
    { title: '센터장 연락처', contents: _data?.MASTER_PHONE || '-', size: null },
    { title: '소속회사', contents: '밸런스플레이', size: null },
    { title: 'SNS', contents: sns, size: null },
    { title: '주소', contents: address, size: 13 },
    { title: '소개말', contents: _data?.DESCRIPTION || '-', size: null, position: 'flex-start' },
  ], [_data, address, sns]);

  const getCenter = () => {
    useAxios.get('/centerDetail').then(({ data }) => {
      if (!data?.result || !data?.data) return _setData(null);
      _setData(data?.data);
    })
  }

  useEffect(getCenter, []);

  return (
    <Style.Wrap>
      {/* 정보 */}
      {data?.length > 0 && data?.map((item, i) => (
        <Style.Row key={i} style={{ alignItems: item?.position ?? '' }}>
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