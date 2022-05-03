import React from 'react';
import Styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function ({ item, list }) {
  const navigate = useNavigate();
  const timeView = t => t?.date?.split(' ')[1];
  const listClick = () => navigate('/totalresult/' + item?.replaceAll('-', ''));
	return (
		<Wrap onClick={listClick}>
      <td>
        <span className='date'>
          {item?.split(' ')[0] ?? '-'}
        </span>
      </td>
      <td>
        {list && list.map(item => (
          <div key={item.id}>
            <span className='time'>{timeView(item)}</span>
          </div>
        ))}
      </td>
      <td>
        {list && list.map(item => (
          <div key={item.id}>
            <img src={item.icon} alt='아이콘' />
            <span>{item.testName}</span>
          </div>
        ))}
      </td>
    </Wrap>
	)
}

const Wrap = Styled.tr`
  cursor: pointer;
  td {
    letter-spacing: 1px;
    span {
      white-space: nowrap;
    }
    & > div {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 25px;
      margin-bottom: 3px;
      &:last-of-type {
        margin-bottom: 0;
      }

      img {
        margin-right: 4px;
      }
    }

    @media screen and (max-width: 500px) {
      &:nth-of-type(2) {
        display: none;
      }
    }
    
  }
`