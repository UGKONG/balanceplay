import React from 'react';
import Styled from 'styled-components';

export default function ({ data, setIsModal }) {

  return (
    <div className='modal'>
      <div className='wrap'>
        <h2>검사 설명</h2>
        <div className='contents'>
          <MainDescription>{data?.main}</MainDescription>
          {data?.sub && data?.sub.map(item => (
            <SubDescription key={item.ID} dangerouslySetInnerHTML={{__html: item.DESCRIPTION}} />
          ))}
        </div>
        <button onClick={() => setIsModal(false)}>닫 기</button>
      </div>

      <div className='bg' onClick={() => setIsModal(false)} />
    </div>
  )
}

const MainDescription = Styled.p`
  font-weight: 500;
`;
const SubDescription = Styled.p`
  margin-top: 10px;
`;