import React from 'react';
import Styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function ({ item, idx }) {
  const navigate = useNavigate();

  const detailView = () => navigate('/notice/' + item.ID);

  return (
    <Wrap onClick={detailView}>
      <td>{idx + 1}</td>
      <td>{item?.TITLE ?? '-'}</td>
      <td>{item?.DATE ?? '-'}</td>
    </Wrap>
  )
}

const Wrap = Styled.tr`
  cursor: pointer;

  @media screen and (max-width: 500px) {
    td:nth-of-type(3) {
      display: none;
    }
  }
`;