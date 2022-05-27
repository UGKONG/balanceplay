import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import useAxios from '%/useAxios';
import useAlert from '%/useAlert';
import PageAnimate from '%/PageAnimate';

export default function 히스토리 () {

  return (
    <PageAnimate name='slide-up' style={{ overflow: 'auto' }}>
      히스토리
    </PageAnimate>
  )
}

