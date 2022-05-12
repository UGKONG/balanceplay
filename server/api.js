const mysql = require('mysql');
const conf = require('./config.json');

// DB 연결 함수
const dbConnect = callback => {
  let db = mysql.createConnection(conf.db, err => err && console.log('DB가 연결되지 않았습니다.'));
  callback(db);
}
// 성공
const success = data => ({ result: true, data });
// 실패
const fail = msg => ({ result: false, msg });

// DEV 로그인
module.exports.devLogin = (req, res) => {
  req.body = {
    EMAIL: 'jsw01137@naver.com',
    CENTER_ID: 1,
    AUTH_ID: 18676062870
  }
  this.login(req, res);
}
// 세션확인
module.exports.isSession = (req, res) => {
  let isSession = req?.session?.isLogin;
  if (!isSession) return res.send(fail('세션이 만료되었습니다.'));
  res.send(success(isSession));
}
// 센터 리스트 조회
module.exports.getCenter = (req, res) => {
  dbConnect(db => {
    db.query(`
      SELECT
      CENTER_SN AS ID, COMPANY_SN AS COMPANY_ID, CENTER_NM AS NAME,
      MANAGER_NAME AS MASTER_NAME, MANAGER_PHONE AS MASTER_PHONE, 
      MANAGER_EMAIL AS MASTER_EMAIL, CENTER_PHONE
      FROM tb_center;
    `, (err, result) => {
      if (err) {
        console.log(err);
        res.send(fail('센터 리스트 조회를 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 회원 정보 SELECT Query
const userSelectQuery = `
  USER_SN AS ID, IMAGE_PATH AS IMG, EMAIL, AUTH_ID,
  AUTH_SNS AS PLATFORM, USER_NM AS NAME,
  CENTER_SN AS CENTER_ID, CENTER_NM AS CENTER_NAME,
  OGDP_TYPE AS SCHOOL_TYPE, OGDP AS SCHOOL_NAME,
  GNDR AS GENDER, HGHT AS HEIGHT, WGHT AS WEIGHT,
  DATE_FORMAT(CRT_DT, '%Y-%m-%d') AS DATE, 
  DATE_FORMAT(MDFCN_DT, '%Y-%m-%d') AS MODIFY_DATE,
  DATE_FORMAT(LAST_LOGIN_DATE, '%Y-%m-%d %H:%i:%s') AS LAST_LOGIN_DATE
`
// SNS 로그인
module.exports.snsLogin = (req, res) => {
  let authId = req?.body?.authId ?? null;
  let email = req?.body?.email ?? null;

  dbConnect(db => {
    db.query(`
      SELECT ${userSelectQuery} FROM tn_user
      WHERE EMAIL = '${email}' AND AUTH_ID = '${authId}';
    `, (err, result) => {
      db.end();
      if (err) return res.send(fail('DB Error'));

      if (result.length === 0) {
        dbConnect(db => {
          db.query(`
            SELECT ${userSelectQuery} FROM tn_user
            WHERE EMAIL = '${email}'
          `, (err, result) => {
            db.end();
            if (err) return res.send(fail('DB Error'));
            if (result.length === 0) return res.send(success(null));
            res.send(success(email));
          });
        });
        return;
      }
      
      res.send(success(result[0]));
    });
  });
}
// 로그인
module.exports.login = (req, res) => {
  let data = req.body;
  let EMAIL = data?.EMAIL;
  let CENTER_ID = data?.CENTER_ID;
  let AUTH_ID = data?.AUTH_ID;
  console.log('로그인 유저:', data);

  console.log(EMAIL, CENTER_ID, AUTH_ID);
  if (!EMAIL || !CENTER_ID || !AUTH_ID) {
    console.log('회원 정보가 없습니다.');
    res.send(fail('회원 정보가 없습니다.'));
    return;
  }

  dbConnect(db => {
    db.query(`
      SELECT ${userSelectQuery} FROM tn_user 
      WHERE EMAIL = '${EMAIL}' AND AUTH_ID = '${AUTH_ID}' AND CENTER_SN = '${CENTER_ID}';
    `, (err, result) => {
      if (err) {
        db.end();
        console.log(err);
        req.session.isLogin = null;
        res.send(fail('로그인 실패'));
        return;
      }
      console.log(result[0]);
      req.session.isLogin = result[0];
      res.send(success(result[0]));

      db.query(`UPDATE tn_user SET LAST_LOGIN_DATE = NOW();`, () => db.end());
    });
  });
}
// 로그아웃
module.exports.logout = (req, res) => {
  req.session.destroy(() => res.send(success('LOGOUT')));
}
// 회원가입
module.exports.join = (req, res) => {
  let data = req?.body;
  let validator = Object.keys(data).length > 0;
  if (!validator) return res.send(fail('회원가입 정보가 없습니다.'));
  let info = data?.info;
  let family = data?.family;
  let test = data?.test;
  let now = data?.now;
  let other = data?.other;

  let familyInsertSQL = [];
  family.forEach(item => {
    familyInsertSQL.push(`
      (@USER_SN, '${item?.name}', '${item?.type}', '${item?.birth}',
      '${item?.height}', '${item?.isTogether ? 1 : 0}', '${item?.description}')
    `);
  });

  dbConnect(db => {
    db.query(`
      INSERT INTO tn_user 
      (
        EMAIL,AUTH_ID,AUTH_SNS,USER_NM,
        CENTER_SN,CENTER_NM,OGDP_TYPE,OGDP,
        GNDR,HGHT,WGHT,IMAGE_PATH
      ) VALUES (
        '${info?.email}', '${info?.authId}', '${info?.authSns}', '${info?.name}', 
        '${info?.center?.ID}', '${info?.center?.NAME}', '${info?.ogdpType?.id}', '${info?.ogdpName}', 
        '${info?.gender}', '${info?.height}', '${info?.weight}', '${info?.img}'
      );

      SET @USER_SN = LAST_INSERT_ID();

      INSERT INTO tn_user_initial_data
      (
        USER_SN, USER_NM, CENTER_SN, BRTHDAY, GNDR,
        HGHT, WGHT, OGDP_TYPE, OGDP, 
        VST_OBJ, LANG_DEV_LV, LANG_DEV_LV_DESC,
        SLP, BWL, FD, 
        FRND_REL, FMLY_REL, DEV_DIAG, DEV_DESC
      ) VALUES (
        @USER_SN, '${info?.name}', '${info?.center?.ID}', '${info?.birth}', '${info?.gender}', 
        '${info?.height}', '${info?.weight}', '${info?.ogdpType?.id}', '${info?.ogdpName}', 
        '${info?.visitObj?.values?.join(',')}', '${test?.id}', '${test?.name}', 
        '${now[0]?.value}', '${now[1]?.value}', '${now[2]?.value}', 
        '${now[3]?.value}', '${now[4]?.value}', '${other?.isOther ? 1 : 2}', '${other?.contents}'
      );

      ` + 
      (familyInsertSQL.length > 0 ?       
      `
      INSERT INTO tn_user_fmly
      (
        USER_SN, FMLY_NM, FMLY_TP, BRTHDAY,
        HGHT, LIVE_TGHR, ETC
      ) VALUES ${familyInsertSQL.join(',')};

    ` : ''), (err, result) => {
      if (err) {
        db.end();
        console.log(err);
        res.send(fail('회원가입에 실패하였습니다.'));
        return;
      }

      db.query(`
        SELECT
        ${userSelectQuery}
        FROM tn_user WHERE AUTH_ID = '${info?.authId}';
      `, (err, result) => {
        db.end();
        if (err) {
          console.log(err);
          res.send(fail('회원조회에 실패하였습니다.'));
          return;
        }
        if (result.length === 0) {
          console.log('회원이 없습니다.');
          res.send(fail('회원이 없습니다.'));
          return;
        }
        console.log(`회원가입 성공 (일련번호: ${result[0]?.ID} / ${result[0]?.NAME})`);
        res.send(success(result[0]));
      })
    });
  });

}
// 검사개요 조회
module.exports.getTestInformation = (req, res) => {
  let sendData = {};

  dbConnect(db => {
    db.query(`
      SELECT
      a.TEST_TP_SN AS ID,
      a.TEST_TP_NM AS NAME,
      a.TEST_TP_DESC AS DESCRIPTION,
      a.TEST_TP_METHOD AS METHOD
      FROM tn_test_tp a
    `, (err, result) => {
      if (err) {
        db.end();
        console.log(err);
        return res.send(fail('검사 개요 정보를 불러오는데 실패하였습니다.'));
      }
      sendData.main = result;

      db.query(`
        SELECT
        a.DCSN_SN AS ID,
        a.TEST_TP_SN AS TYPE_ID,
        a.DCSN_NM AS NAME,
        a.DCSN_DSCRT AS DESCRIPTION
        FROM tn_test_dcsn a
      `, (err, result) => {
        db.end();
        if (err) {
          console.log(err);
          return res.send(fail('검사 개요 정보를 불러오는데 실패하였습니다.'));
        }
        sendData.sub = result;
        res.send(success(sendData));
      });
    });
  })
}
// 나의 모든 검사 리스트
module.exports.getMyTestList = (req, res) => {
  let userId = req.session?.isLogin?.ID;
  if (!userId) return res.send(fail('검사 리스트를 불러올 회원의 일련번호가 없습니다.'));
  
  dbConnect(db => {
    db.query(`
      SELECT
      TEST_SN AS ID,
      TEST_TP_SN AS TEST_ID,
      TEST_NM AS TEST_NAME,
      DATE_FORMAT(CRT_DT, '%Y-%m-%d %H:%i:%s') AS DATE
      FROM tn_test
      WHERE USER_SN = '${userId}' AND TEST_TP_SN <> 2;
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('검사 리스트를 불러오는데 실패하였습니다.'));
        return;
      }

      res.send(success(result));

    });
  })
}
// 종합결과
module.exports.getTotalResult = (req, res) => {
  let date = req?.params?.id;
  if (!date) return res.send(fail('종합결과의 기준 날짜가 없습니다.'));
  
  dbConnect(db => {
    db.query(`
    SELECT 
    TEST_TP_SN AS ID,
    TEST_TP_NM AS NAME,
    TEST_TP_METHOD AS METHOD,
    TEST_TP_DESC AS DESCRIPTION
    FROM tn_test_tp;

    SELECT 
    a.TEST_TP_SN AS TEST_ID, 
    b.TEST_TP_NM AS TEST_NAME, 
    a.DCSN_SN AS CATEGORY_ID, 
    c.DCSN_NM AS CATEGORY_NAME, 
    c.MAX_PNT AS MAX_POINT,
    a.CAT_PNT AS POINT
    FROM tn_test_rslt a
    LEFT JOIN tn_test_tp b ON a.TEST_TP_SN=b.TEST_TP_SN
    LEFT JOIN tn_test_dcsn c ON a.DCSN_SN=c.DCSN_SN
    LEFT JOIN tn_test_dcsn_dtl d ON a.DCSN_DTL_SN=d.DCSN_DTL_SN
    WHERE a.TEST_SN IN (
      SELECT MAX_TEST_SN FROM (
        SELECT TEST_TP_SN, MAX(TEST_SN) MAX_TEST_SN 
        FROM tn_test
        WHERE DATE(CRT_DT) <= DATE('${date}')
        GROUP BY TEST_TP_SN
      ) f1
    );
    
    SELECT 
    a.TEST_TP_SN AS TEST_ID, 
    b.TEST_TP_NM AS TEST_NAME,
    a.CMNT_SN AS CATEGORY_ID, 
    c.CMNT_NM AS CATEGORY_NAME, 
    c.CMNT_GRADE AS GRADE, 
    c.MAX_PNT AS MAX_POINT, 
    a.CMNT_PNT AS POINT, 
    c.CMNT_DSCRT AS COMMENT, 
    c.CMNT_TOTAL AS TOTAL_COMMENT,
    DATE_FORMAT(d.CRT_DT, '%Y-%m-%d') AS DATE
    FROM tn_test_cmnt_rslt a
    LEFT JOIN tn_test_tp b ON a.TEST_TP_SN = b.TEST_TP_SN
    LEFT JOIN tn_test_cmnt c ON a.CMNT_DTL_SN = c.CMNT_DTL_SN
    LEFT JOIN tn_test d ON a.TEST_SN = d.TEST_SN
    WHERE a.TEST_SN IN (
      SELECT MAX_TEST_SN FROM (
        SELECT TEST_TP_SN, MAX(TEST_SN) MAX_TEST_SN 
        FROM tn_test
        WHERE DATE(CRT_DT) <= DATE('${date}')
        GROUP BY TEST_TP_SN
      ) f1
    );
    
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        return res.send(fail('종합결과를 불러오는데 실패하였습니다.'));
      }

      let testList = result[0];
      let pointData = result[1];
      let commentData = result[2];

      console.log('pointData:', pointData.length);
      console.log('commentData:', commentData.length);

      if (testList?.length === 0 || pointData?.length === 0 || commentData?.length === 0) {
        return res.send(success(null));
      }

      let temp = [];
      testList?.forEach(({ ID, NAME }) => {
        let POINT = pointData?.filter(x => x.TEST_ID === ID) ?? null;
        let COMMENT = commentData?.filter(x => x.TEST_ID === ID) ?? null;
        if (POINT.length > 0 && COMMENT.length > 0) {
          temp.push({ ID, NAME, POINT, COMMENT });
        }
      });

      res.send(success(temp));
    });
  })
}
// 검사 상세 페이지 초기 데이터 조회, 검사 결과 상세 조회
module.exports.getDetailResult = (req, res) => {
  let id = req.params?.id;
  let sendData = {};

  dbConnect(db => {
    db.query(`
      SELECT 
      TEST_TP_SN AS ID,
      TEST_TP_NM AS NAME,
      TEST_TP_METHOD AS METHOD,
      TEST_TP_DESC AS DESCRIPTION
      FROM tn_test_tp
      WHERE TEST_TP_SN = '${id}'
    `, (err, result) => {
      if (err || result.length === 0) {
        err && console.log(err);
        res.send(fail('해당 검사정보가 없습니다.'));
        db.end();
        return;
      }
      sendData.info = result[0];

      db.query(`
        SELECT 
        DCSN_SN AS ID,
        DCSN_NM AS NAME,
        DCSN_DSCRT AS DESCRIPTION
        FROM tn_test_dcsn
        WHERE TEST_TP_SN = '${id}'
      `, (err, result) => {
        err && console.log(err);
        sendData.description = err ? [] : result;

        db.query(`
          SELECT 
          a.TEST_SN AS ID, a.TEST_TP_SN AS TEST_ID, b.TEST_TP_NM AS TEST_NAME,
          a.DCSN_SN AS CATEGORY_ID, c.DCSN_NM AS CATEGORY_NAME, a.DCSN_DTL_SN AS TEST_RESULT_ID, 
          d.DCSN_DTL_NM AS GRADE, c.MAX_PNT AS MAX_POINT, a.CAT_PNT AS POINT, 
          DATE_FORMAT(e.CRT_DT, '%Y-%m-%d') AS DATE
          FROM tn_test_rslt a	
          INNER JOIN tn_test_tp b ON a.TEST_TP_SN = b.TEST_TP_SN
          INNER JOIN tn_test_dcsn c ON a.DCSN_SN = c.DCSN_SN
          INNER JOIN tn_test_dcsn_dtl d ON a.DCSN_DTL_SN = d.DCSN_DTL_SN
          INNER JOIN tn_test e on a.TEST_SN = e.TEST_SN
          WHERE a.TEST_TP_SN = '${id}'
          ORDER BY e.CRT_DT DESC;
        `, (err, result) => {
          err && console.log(err);
          sendData.pointResult = err ? [] : result;
          
          db.query(`
            SELECT 
            a.TEST_SN AS ID, a.TEST_TP_SN AS TEST_ID, b.TEST_TP_NM AS TEST_NAME,
            a.CMNT_SN AS CATEGORY_ID, c.CMNT_NM AS CATEGORY_NAME, c.CMNT_GRADE AS GRADE, 
            c.MAX_PNT AS MAX_POINT, a.CMNT_PNT AS POINT, c.CMNT_DSCRT AS COMMENT, c.CMNT_TOTAL AS TOTAL_COMMENT,
            DATE_FORMAT(d.CRT_DT, '%Y-%m-%d') AS DATE
            FROM tn_test_cmnt_rslt a
            INNER JOIN tn_test_tp b ON a.TEST_TP_SN = b.TEST_TP_SN
            INNER JOIN tn_test_cmnt c ON a.CMNT_DTL_SN = c.CMNT_DTL_SN
            INNER JOIN tn_test d on a.TEST_SN = d.TEST_SN
            WHERE a.TEST_TP_SN = '${id}'
            ORDER BY d.CRT_DT DESC;
          `, (err, result) => {
            db.end();
            err && console.log(err);
            sendData.commentResult = err ? [] : result;

            res.send(success(sendData));
          })
        })
      });
    })
  });
}
// 신규 검사 초기 데이터 조회
module.exports.getDoSurvey = (req, res) => {
  let id = req?.params?.id;
  if (!id) return res.send(fail('검사 ID가 없습니다.'));
  let sendData = { category: [], ask: [], answer: [] };

  dbConnect(db => {
    db.query(`
      SELECT
      CAT_SN AS 'ID',
      CAT_NM AS 'CATEGORY_NAME',
      DCSN_SN AS 'PAGE_ID',
      TOOL, INSTR AS 'TOOL_DESCRIPTION'
      FROM tn_test_cat
      WHERE TEST_TP_SN = '${id}'
    `, (err, result) => {
      if (err || result.length === 0) {
        db.end();
        console.log(err);
        res.send(fail('검사지 카테고리 정보가 존재하지 않습니다.'));
        return;
      }

      sendData.category = result;

      db.query(`
        SELECT
        QSTN_SN AS 'ID',
        CAT_SN AS 'CATEGORY_ID',
        CAT_NM AS 'CATEGORY_NAME',
        ITM_GRP AS 'ITEM_GROUP',
        QSTN_ODR AS 'ORDER',
        QSTN_TYPE AS 'TYPE',
        QSTN_CN AS 'ASK'
        FROM tn_surv_qstn
        WHERE TEST_TP_SN = '${id}'
      `, (err, result) => {
        if (err || result.length === 0) {
          db.end();
          console.log(err);
          res.send(fail('검사지 질문 정보가 존재하지 않습니다.'));
          return;
        }

        sendData.ask = result;

        db.query(`
          SELECT
          ITM_SN AS 'ID',
          ITM_GRP AS 'ITEM_GROUP',
          ITM_ODR AS 'ORDER',
          ITM_TYPE AS 'TYPE',
          ITM_CN AS 'ANSWER',
          ITM_PNT AS 'POINT'
          FROM tn_surv_itm
        `, (err, result) => {
          db.end();
          if (err || result.length === 0) {
            console.log(err);
            res.send(fail('검사지 답변 정보가 존재하지 않습니다.'));
            return;
          }

          sendData.answer = result;
          res.send(success(sendData));
        });
      })
    });
  });
  
}
// 신규 검사 저장
module.exports.postDoSurvey = (req, res) => {
  let userId = req?.session?.isLogin?.ID;
  let testTypeId = req?.body?.testTypeId;
  let testName = req?.body?.testName;
  let data = req?.body?.data;
  if (data?.length === 0 || !userId || !testTypeId || !testName) {
    res.send(fail('데이터가 없습니다.'));
    return;
  }
  
  let insertSQL = data?.map(item => {
    let result = `(@TEST_ID, ${item?.ASK}, ${item?.ANSWER})`;
    return result;
  });

  dbConnect(db => {
    db.query(`
      INSERT INTO tn_test
      (TEST_NM, TEST_TP_SN, USER_SN)
      VALUES
      ('${testName}', '${testTypeId}', '${userId}');

      SET @TEST_ID = LAST_INSERT_ID();

      INSERT INTO tn_test_rspns
      (TEST_SN, QSTN_SN, ITM_SN)
      VALUES ${insertSQL.join(',')};

      INSERT INTO tn_test_rslt
      (TEST_SN,TEST_TP_SN,CAT_SN,DCSN_SN,DCSN_DTL_SN,CAT_PNT)
      SELECT f.TEST_SN,f.TEST_TP_SN,f.CAT_SN,f.DCSN_SN,g.DCSN_DTL_SN,f.CAT_PNT
      FROM (SELECT a.TEST_SN, c.TEST_TP_SN, d.CAT_SN, e.DCSN_SN, SUM(b.itm_pnt) AS CAT_PNT 
        FROM tn_test_rspns a
        INNER JOIN tn_surv_itm b ON a.itm_sn=b.itm_sn
        INNER JOIN tn_test c ON a.test_sn = c.test_sn
        INNER JOIN tn_surv_qstn d ON a.QSTN_SN=d.QSTN_SN
        INNER JOIN tn_test_cat e ON d.cat_sn=e.cat_sn
        WHERE a.TEST_SN = @TEST_ID
        GROUP BY TEST_SN, TEST_TP_SN, CAT_SN, DCSN_SN) f
      INNER JOIN tn_test_dcsn_dtl g ON f.DCSN_SN = g.DCSN_SN AND  f.CAT_PNT >= g.CRTR_LOW AND f.CAT_PNT <= g.CRTR_HIGH;

      INSERT INTO tn_test_cmnt_rslt (TEST_SN,TEST_TP_SN,CMNT_SN,CMNT_DTL_SN,CMNT_PNT)
      SELECT e.TEST_SN, e.TEST_TP_SN, e.CMNT_SN, f.CMNT_DTL_SN, e.CMNT_PNT
      FROM (SELECT a.TEST_SN, c.TEST_TP_SN, d.CMNT_SN, SUM(itm_pnt) AS CMNT_PNT
        FROM tn_test_rspns a
        INNER JOIN tn_surv_itm b ON a.itm_sn = b.itm_sn
        INNER JOIN tn_test c ON a.test_sn = c.test_sn
        INNER JOIN tn_surv_qstn d ON a.QSTN_SN = d.QSTN_SN
        WHERE a.TEST_SN = @TEST_ID
        GROUP BY TEST_SN, TEST_TP_SN, CMNT_SN) e
      INNER JOIN tn_test_cmnt f ON e.TEST_TP_SN = f.TEST_TP_SN AND e.CMNT_SN = f.CMNT_SN AND e.CMNT_PNT >= f.CRTR_LOW AND e.CMNT_PNT<=f.CRTR_HIGH;
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('검사지 저장에 실패하였습니다.'));
        return;
      }
      res.send(success('저장되었습니다.'));
    })
  });
}
// 공지사항
module.exports.getNotice = (req, res) => {
  dbConnect(db => {
    db.query(`
      SELECT
      NTC_SN AS ID,
      NTC_TTL AS TITLE,
      DATE_FORMAT(CRT_DT, '%Y-%m-%d') AS DATE
      FROM
      tn_notice
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('공지사항을 불러오는데 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 공지사항 상세
module.exports.getNoticeDetail = (req, res) => {
  let id = req.params?.id;

  dbConnect(db => {
    db.query(`
      SELECT
      a.NTC_SN AS ID,
      a.NTC_TTL AS TITLE,
      a.NTC_CTNT AS CONTENT,
      b.USER_NM AS USER,
      DATE_FORMAT(a.CRT_DT, '%Y-%m-%d') AS DATE
      FROM
      tn_notice a
      LEFT JOIN tn_user b ON b.USER_SN = a.CRT_USER_SN
      WHERE a.NTC_SN = '${id}'
    `, (err, result) => {
      db.end();
      if (err || result.length === 0) {
        console.log(err);
        res.send(fail('공지사항 정보를 불러오는데 실패하였습니다.'));
        return;
      }
      res.send(success(result[0]));
    });
  });
}
// 