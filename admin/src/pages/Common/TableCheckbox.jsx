import React, { useState, useEffect, useRef } from 'react';
import Styled from 'styled-components';
import { BsCheck } from "react-icons/bs";

export default function 체크박스 ({ ref = null, checked = false, onChange = e => {console.log(e)}, size = 41, style = {} }) {
  const checkboxRef = useRef(null);
  const [_id, _setId] = useState('');
  const [_checked, _setChecked] = useState(checked);

  const makeId = () => {
    let date = new Date();
    let tempId = date.getTime();
    let random = parseInt(Math.random() * 1000);
    _setId('C_' + String(tempId) + String(random));
    checkboxRef.current.parentNode.style.padding = 0;
  }
  const _onChange = e => {
    let isChecked = e.target.checked;
    _setChecked(isChecked);
    onChange(isChecked);
  }

  useEffect(makeId, []);
  useEffect(() => _setChecked(checked), [checked]);

  return (
    <Wrap size={size} style={style} ref={checkboxRef}>
      <Input type='checkbox' id={_id} checked={_checked} onChange={_onChange} />
      <Label htmlFor={_id}><BsCheck /></Label>
    </Wrap>
  )
}

const Wrap = Styled.div`
  display: flex;
  width: ${x => x.size}px;
  height: ${x => x.size}px;
`;
const Input = Styled.input`
  display: none;
  &:checked + label {
    color: #008a87;
  }
`;
const Label = Styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  transition: 0.1s;
  position: relative;
  color: #b9e1dc;
  font-size: 30px;
`;