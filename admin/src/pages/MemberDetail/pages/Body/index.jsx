import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';

export default function 건강데이터 () {

  return (
    <PageAnimate name='slide-up' style={{ overflow: 'auto' }}>
      건강데이터
    </PageAnimate>
  )
}

