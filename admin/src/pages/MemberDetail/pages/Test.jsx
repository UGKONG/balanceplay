import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';

export default function 검사데이터 () {

  return (
    <PageAnimate name='slide-up' style={{ overflow: 'auto' }}>
      검사 데이터
    </PageAnimate>
  )
}

