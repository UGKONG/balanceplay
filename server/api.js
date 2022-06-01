const mysql = require('mysql');
const conf = require('./config.json');
const { getClientIp } = require('request-ip');
const ExcelJS = require('exceljs');

// DB 연결 함수
const dbConnect = callback => {
  let db = mysql.createConnection(conf.db, err => err && console.log('DB가 연결되지 않았습니다.'));
  callback(db);
}
// 성공
const success = data => ({ result: true, data });
// 실패
const fail = msg => ({ result: false, msg });
// 로그
const log = req => {
  let user = req?.session?.isLogin;
  let path = req?.url;
  let method = req?.method;
  let body = JSON.stringify(req?.body);
  let ip = getClientIp(req);
  if (ip?.indexOf('::ffff:') > -1) ip = ip?.split('::ffff:')[1];
  if (ip === '::1') ip = '127.0.0.1';
  console.log(`${user?.NAME}(${user?.ID}): ${method} ${path}\nbody ${body}`);

  dbConnect(db => {
    db.query(`
      INSERT INTO tn_log (PATH, BODY, METHOD, IP) 
      VALUE ('${path}', '${body}', '${method}', '${ip}');
    `, () => db.end());
  });
}

// OTHER
module.exports.getOtherList = (req, res) => {
  let table = req?.params?.table;
  dbConnect(db => {
    db.query(`
      SELECT * FROM ${table};
    `, (err, result) => {
      db.end();
      res.send(err ? [] : result);
    })
  })
}
module.exports.getOtherData = (req, res) => {
  let table = req?.params?.table;
  let id = req?.params?.id;
  dbConnect(db => {
    db.query(`
      SHOW INDEX FROM ${table};
    `, (err, result) => {
      let idColumnName = result[0]?.Column_name;
      db.query(`
        SELECT * FROM ${table} WHERE ${idColumnName} = ${id};
      `, (err, result) => {
        db.end();
        res.send(err ? null : result[0]);
      })
    })
  })
}

// DEV 로그인
module.exports.devLogin = (req, res) => {
  req.body = {
    EMAIL: 'jsw9330@naver.com',
    CENTER_ID: 2,
    AUTH_ID: 'kb9VERXkAn7mKbtyyYuD6paXlCnjNQmLFTSMscm0czk'
  }
  this.login(req, res);
}
module.exports.getLog = (req, res) => {
  dbConnect(db => {
    db.query(`
      SELECT
      ID, METHOD, PATH, IP, DATE_FORMAT(DATE, '%Y-%m-%d %H:%i:%s') AS DATE
      FROM tn_log ORDER BY ID DESC LIMIT 1000;
    `, (err, result) => {
      db.end();
      err && console.log(err);
      if (err) return res.send(success([]));
      res.send(success(result));
    });
  })
}
// GUEST 로그인
module.exports.guestLogin = (req, res) => {
  req.body = {
    EMAIL: 'jsw01137@naver.com',
    CENTER_ID: 1,
    AUTH_ID: 1867606287
  }
  this.login(req, res);
}
// 세션확인
module.exports.isSession = (req, res) => {
  let isSession = req?.session?.isLogin;
  let prontIsAdmin = eval(req.query?.IS_ADMIN);
  let backIsAdmin = eval(isSession?.IS_ADMIN);
  if (!isSession || prontIsAdmin != backIsAdmin) {
    res.send(fail('세션이 만료되었습니다.'));
    return;
  }

  res.send(success(isSession));
}
// IP 확인
module.exports.getIp = (req, res) => {
  let ip = getClientIp(req);
  if (ip?.indexOf('::ffff:') > -1) ip = ip?.split('::ffff:')[1];
  if (ip === '::1') ip = '127.0.0.1';
  res.send(success(ip));
}
// 센터 리스트 조회
module.exports.getCenter = (req, res) => {
  log(req);
  dbConnect(db => {
    db.query(`
      SELECT
      CENTER_SN AS ID, COMPANY_SN AS COMPANY_ID, CENTER_NM AS NAME,
      MANAGER_NAME AS MASTER_NAME, MANAGER_PHONE AS MASTER_PHONE, 
      MANAGER_EMAIL AS MASTER_EMAIL, CENTER_PHONE,
      ADDRESS_PROVINCE AS ADDRESS1,
      ADDRESS_CITY AS ADDRESS2,
      ADDRESS_DETAIL AS ADDRESS3
      FROM tb_center;
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('센터 리스트 조회를 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 센터 상세정보 조회
module.exports.getCenterDetail = (req, res) => {
  log(req);
  dbConnect(db => {
    db.query(`
      SELECT
      CENTER_SN AS ID, COMPANY_SN AS COMPANY_ID, CENTER_NM AS NAME,
      MANAGER_NAME AS MASTER_NAME, MANAGER_PHONE AS MASTER_PHONE, 
      MANAGER_EMAIL AS MASTER_EMAIL, CENTER_PHONE,
      CENTER_SNS AS SNS,
      ADDRESS_PROVINCE AS ADDRESS1,
      ADDRESS_CITY AS ADDRESS2,
      ADDRESS_DETAIL AS ADDRESS3,
      CENTER_DESCRIPTION AS DESCRIPTION
      FROM tb_center WHERE CENTER_SN = '${req?.session?.isLogin?.CENTER_ID}';
    `, (err, result) => {
      db.end();
      if (err || result?.length === 0) {
        console.log(err);
        res.send(fail('센터 리스트 조회를 실패하였습니다.'));
        return;
      }
      res.send(success(result[0]));
    })
  })
}
// 회원 정보 SELECT Query
const userSelectQuery = `
  USER_SN AS ID, IMAGE_PATH AS IMG, EMAIL, AUTH_ID,
  AUTH_SNS AS PLATFORM, USER_NM AS NAME, BIRTH,
  CENTER_SN AS CENTER_ID, CENTER_NM AS CENTER_NAME,
  OGDP_TYPE AS SCHOOL_TYPE, OGDP AS SCHOOL_NAME,
  GNDR AS GENDER, HGHT AS HEIGHT, WGHT AS WEIGHT,
  IS_DELETE, TEST_FLAG, MEMO,
  DATE_FORMAT(CRT_DT, '%Y-%m-%d %H:%i:%s') AS DATE, 
  DATE_FORMAT(MDFCN_DT, '%Y-%m-%d %H:%i:%s') AS MODIFY_DATE
`
// SNS 로그인
module.exports.snsLogin = (req, res) => {
  log(req);
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
  log(req);
  let data = req.body;
  let EMAIL = data?.EMAIL;
  let CENTER_ID = data?.CENTER_ID;
  let AUTH_ID = data?.AUTH_ID;

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
      db.end();
      if (err || result?.length === 0) {
        err && console.log(err);
        req.session.isLogin = null;
        res.send(fail('일치하는 회원이 없습니다.'));
        return;
      }

      let userData = {...result[0], IS_ADMIN: false};

      if (userData?.IS_DELETE === 1) {
        console.log('탈퇴된 회원 로그인 요청 (SN: ' + userData?.ID + ')');
        req.session.isLogin = null;
        res.send(fail('회원탈퇴된 회원입니다.'));
        return;
      }
      
      console.log('로그인 유저:', userData);
      req.session.isLogin = userData;
      res.send(success(userData));
    });
  });
}
// 로그아웃
module.exports.logout = (req, res) => {
  log(req);
  req.session.destroy(() => res.send(success('LOGOUT')));
}
// 회원가입
module.exports.join = (req, res) => {
  log(req);
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
      '${item?.isTogether ? 1 : 0}', '${item?.description}')
    `);
  });

  dbConnect(db => {
    db.query(`
      INSERT INTO tn_user 
      (
        EMAIL,AUTH_ID,AUTH_SNS,USER_NM,
        CENTER_SN,CENTER_NM,BIRTH,OGDP_TYPE,OGDP,
        GNDR,HGHT,WGHT,IMAGE_PATH
      ) VALUES (
        '${info?.email}', '${info?.authId}', '${info?.authSns}', '${info?.name}', 
        '${info?.center?.ID}', '${info?.center?.NAME}', '${info?.birth}', '${info?.ogdpType?.id}', '${info?.ogdpName}', 
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
        LIVE_TGHR, ETC
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
// 메뉴 조회
module.exports.getMenu = (req, res) => {
  let type = req.params.id;
  if (!type) return res.send(fail('메뉴의 타입이 없습니다. (회원용: 1 / 관리자용: 2)'));
  
  dbConnect(db => {
    db.query(`
      SELECT
      a.ID, a.TYPE, a.TO, a.NAME, a.ORDER,
      b.TEST_TP_METHOD AS METHOD
      FROM tn_menu a 
      LEFT JOIN tn_test_tp b ON a.NAME = b.TEST_TP_NM
      WHERE a.TYPE = ${type} 
      ORDER BY a.ORDER ASC;
    `, (err, result) => {
      db.end();
      err && console.log(err);
      res.send(success(err ? [] : result));
    });
  });
}
// 검사개요 조회
module.exports.getTestInformation = (req, res) => {
  log(req);
  let sendData = {};

  dbConnect(db => {
    db.query(`
      SELECT
      a.TEST_TP_SN AS ID,
      a.TEST_TP_NM AS NAME,
      a.TEST_TP_DESC AS DESCRIPTION,
      a.TEST_TP_METHOD AS METHOD,
      a.TEST_TP_METHOD_TEXT AS METHOD_TEXT,
      a.MONTH_LOW AS MIN_MONTH, 
      a.MONTH_UPPER AS MAX_MONTH, b.ORDER
      FROM tn_test_tp a
      LEFT JOIN tn_menu b ON a.TEST_TP_NM = b.NAME
      ORDER BY b.ORDER ASC;
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
  log(req);
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
  log(req);
  let date = req?.params?.id;
  if (!date) return res.send(fail('종합결과의 기준 날짜가 없습니다.'));
  
  dbConnect(db => {
    db.query(`
    SELECT 
    TEST_TP_SN AS ID,
    TEST_TP_NM AS NAME,
    TEST_TP_METHOD AS METHOD,
    TEST_TP_METHOD_TEXT AS METHOD_TEXT,
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
        WHERE DATE(CRT_DT) <= DATE('${date}') AND USER_SN = '${req?.session?.isLogin?.ID}'
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
        WHERE DATE(CRT_DT) <= DATE('${date}') AND USER_SN = '${req?.session?.isLogin?.ID}'
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
  log(req);
  let id = req.params?.id;
  let sendData = {};

  dbConnect(db => {
    db.query(`
      SELECT 
      TEST_TP_SN AS ID,
      TEST_TP_NM AS NAME,
      TEST_TP_METHOD AS METHOD,
      TEST_TP_METHOD_TEXT AS METHOD_TEXT,
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
        ORDER BY DCSN_SN ASC;
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
          INNER JOIN tn_test e on a.TEST_SN = e.TEST_SN AND e.USER_SN = '${req?.session?.isLogin?.ID}'
          WHERE a.TEST_TP_SN = '${id}'
          ORDER BY e.CRT_DT DESC, a.DCSN_SN ASC;
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
            INNER JOIN tn_test d on a.TEST_SN = d.TEST_SN AND d.USER_SN = '${req?.session?.isLogin?.ID}'
            WHERE a.TEST_TP_SN = '${id}'
            ORDER BY d.CRT_DT DESC, a.CMNT_SN ASC;
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
  log(req);
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
  log(req);
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
module.exports.postNotice = (req, res) => {
  let userId = req?.session?.isLogin?.ID;
  let centerId = req?.session?.isLogin?.CENTER_ID;
  let { isAdminNotice, title, contents } = req?.body;
  if (!title || !contents) return res.send(fail('공지등록에 실패하였습니다.'));

  dbConnect(db => {
    db.query(`
      INSERT INTO tn_notice 
      (CENTER_ID, NTC_TTL, NTC_CTNT, TYPE, CRT_USER_SN)
      VALUES
      ('${centerId}', '${title}', '${contents}', '${isAdminNotice ? 1 : 0}', '${userId}');
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('공지등록에 실패하였습니다.'));
        return;
      }
      res.send(success(null));
    });
  });
  
}
// 공지사항 리스트 조회
module.exports.getNotice = (req, res) => {
  log(req);
  let centerId = req?.session?.isLogin?.CENTER_ID;
  let searchText = req?.query?.q ?? '';
  dbConnect(db => {
    db.query(`
      SELECT
      a.NTC_SN AS ID,
      a.NTC_TTL AS TITLE,
      a.NTC_CTNT AS CONTENTS,
      a.TYPE, c.NAME AS TYPE_NAME,
      a.CRT_USER_SN AS WRITER_ID,
      b.NAME AS WRITER_NAME,
      DATE_FORMAT(a.CRT_DT, '%Y-%m-%d %H:%i:%s') AS DATE
      FROM tn_notice a
      LEFT JOIN tn_admin b ON a.CRT_USER_SN = b.ID
      LEFT JOIN tn_common c ON a.TYPE = c.CODE AND c.BASE_ID = 6
      WHERE a.CENTER_ID = '${centerId}' AND (a.NTC_TTL LIKE '%${searchText}%' OR a.NTC_CTNT LIKE '%${searchText}%')
      ORDER BY a.CRT_DT DESC;
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
  log(req);
  let centerId = req?.session?.isLogin?.CENTER_ID;
  let id = req.params?.id;

  dbConnect(db => {
    db.query(`
      SELECT
      a.NTC_SN AS ID,
      a.NTC_TTL AS TITLE,
      a.NTC_CTNT AS CONTENT,
      b.USER_NM AS USER,
      a.TYPE, c.NAME AS TYPE_NAME,
      DATE_FORMAT(a.CRT_DT, '%Y-%m-%d') AS DATE
      FROM
      tn_notice a
      LEFT JOIN tn_user b ON b.USER_SN = a.CRT_USER_SN
      LEFT JOIN tn_common c ON a.TYPE = c.CODE AND c.BASE_ID = 6
      WHERE a.CENTER_ID = '${centerId}' AND a.NTC_SN = '${id}'
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
// 작성 검사 결과 조회
module.exports.getSurveyResult = (req, res) => {
  log(req);
  let testId = req?.params?.id;
  if (!testId) return res.send(fail('테스트 일련번호가 없습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT
      a.TEST_SN AS TEST,
      a.QSTN_SN AS ASK,
      a.ITM_SN AS ANSWER,
      b.CAT_SN AS CATEGORY
      FROM tn_test_rspns a
      LEFT JOIN tn_surv_qstn b ON a.QSTN_SN = b.QSTN_SN
      WHERE a.TEST_SN = '${testId}'
      ORDER BY a.QSTN_SN ASC, a.ITM_SN ASC;
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('작성 검사 결과를 조회하는데 실패하였습니다.'));
        return;
      }
      
      res.send(success(result));
    });
  });
}
// 내정보 (아이정보, 가족정보, 초기면접지정보)
module.exports.getMyInfo = (req, res) => {
  log(req);
  let info = req?.session?.isLogin;
  let sendData = {};

  dbConnect(db => {
    db.query(`
      SELECT
      FMLY_SN AS ID,
      FMLY_NM AS NAME,
      FMLY_TP AS TYPE,
      BRTHDAY AS BIRTH,
      LIVE_TGHR AS IS_TOGETHER,
      ETC AS DESCRIPTION
      FROM tn_user_fmly
      WHERE USER_SN = '${info?.ID}';

      SELECT
      a.INITIAL_DATA_SN AS ID,
      a.USER_NM AS NAME,
      a.CENTER_SN AS CENTER,
      b.CENTER_NM AS CENTER_NAME,
      a.BRTHDAY AS BIRTH,
      a.GNDR AS GENDER,
      a.HGHT AS HEIGHT,
      a.WGHT AS WEIGHT,
      a.OGDP_TYPE, a.OGDP AS OGDP_NAME,
      a.VST_OBJ AS VISIT_OBJECT,
      a.LANG_DEV_LV AS TEST_ID,
      a.LANG_DEV_LV_DESC AS TEST_NAME,
      a.SLP AS NOW_1, 
      a.BWL AS NOW_2, 
      a.FD AS NOW_3, 
      a.FRND_REL AS NOW_4,
      a.FMLY_REL AS NOW_5,
      a.DEV_DIAG AS IS_OTHER,
      a.DEV_DESC AS OTHER_DESCRIPTION
      FROM tn_user_initial_data a
      LEFT JOIN tb_center b ON a.CENTER_SN = b.CENTER_SN
      WHERE a.USER_SN = '${info?.ID}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('정보를 불러오는데 실패하였습니다.'));
        return;
      }

      sendData.info = info;
      sendData.family = result[0];
      sendData.joinData = result[1] ? result[1][0] : {};

      res.send(success(sendData));
    })
  })
}
// 내정보 수정 (아이정보)
module.exports.putMyInfo = (req, res) => {
  log(req);
  let data = req?.body;
  let userId = data?.ID;
  if (!userId) return res.send(fail('수정 정보가 없습니다.'));

  dbConnect(db => {
    db.query(`
      UPDATE tn_user SET 
      USER_NM = '${data?.NAME}',
      CENTER_SN = '${data?.CENTER_ID}',
      CENTER_NM = '${data?.CENTER_NAME}',
      GNDR = '${data?.GENDER}',
      HGHT = '${data?.HEIGHT}',
      WGHT = '${data?.WEIGHT}',
      OGDP = '${data?.SCHOOL_NAME}'
      WHERE USER_SN = ${userId};

      SELECT ${userSelectQuery} 
      FROM tn_user 
      WHERE USER_SN = ${userId};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('정보 수정을 하지 못했습니다.'));
        return;
      }

      let newUserData = result[1][0];
      req.session.isLogin = newUserData;
      res.send(success(newUserData));
    })
  });
}
// 내정보 삭제 (회원탈퇴)
module.exports.deleteMyInfo = (req, res) => {
  log(req);
  let userId = req?.params?.id;
  if (!userId) return res.send(fail('회원의 일련번호가 없습니다.'));

  dbConnect(db => {
    db.query(`
      UPDATE tn_user
      SET IS_DELETE = 1
      WHERE USER_SN = ${userId};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('회원탈퇴를 하지 못하였습니다.'));
        return;
      }
      res.send(success(null));
    })
  })
}
// 가족정보 등록
module.exports.postMyFamilyInfo = (req, res) => {
  log(req);
  let userId = req?.params?.id;
  let data = req?.body;

  dbConnect(db => {
    db.query(`
      INSERT INTO tn_user_fmly
      (USER_SN, FMLY_NM, FMLY_TP, BRTHDAY, LIVE_TGHR, ETC)
      VALUES
      ('${userId}', '${data?.NAME}', '${data?.TYPE}', '${data?.BIRTH}', 
      '${data?.IS_TOGETHER}', '${data?.DESCRIPTION}')
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('정보 등록을 하지 못했습니다.'));
        return;
      }
      
      res.send(success(null));
    })
  })
}
// 가족정보 수정
module.exports.putMyFamilyInfo = (req, res) => {
  log(req);
  let data = req?.body;
  let familyId = data?.ID;
  if (!familyId) return res.send(fail('수정 정보가 없습니다.'));
  
  dbConnect(db => {
    db.query(`
      UPDATE tn_user_fmly SET 
      FMLY_NM = '${data?.NAME}',
      BRTHDAY = '${data?.BIRTH}',
      LIVE_TGHR = '${data?.IS_TOGETHER}',
      ETC = '${data?.DESCRIPTION}'
      WHERE FMLY_SN = ${familyId};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('정보 수정을 하지 못했습니다.'));
        return;
      }

      res.send(success(null));
    })
  })
}
// 가족정보 삭제
module.exports.deleteMyFamilyInfo = (req, res) => {
  log(req);
  let familyId = req?.params?.id;
  if (!familyId) return res.send(fail('가족정보의 일련번호가 없습니다.'));

  dbConnect(db => {
    db.query(`
      DELETE FROM tn_user_fmly
      WHERE FMLY_SN = ${familyId};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('가족정보를 삭제하지 못하였습니다.'));
        return;
      }
      res.send(success(null));
    })
  })
}



/////////////////////////////////////////////////////////////////////////////////////////////
// 관리자
// 관리자 로그인
module.exports.adminLogin = (req, res) => {
  log(req);
  let { id, pw } = req?.body;
  
  if (!id) return res.send(fail('아이디를 입력해주세요.'));
  if (!pw) return res.send(fail('비밀번호를 입력해주세요.'));

  dbConnect(db => {
    db.query(`
      SELECT
      a.ID, a.CENTER_ID, b.CENTER_NM AS CENTER_NAME, a.NAME, a.PHONE,
      a.EMAIL, a.GENDER, a.IMAGE_PATH, a.CREATE_DT, a.MODIFY_DT
      FROM tn_admin a
      INNER JOIN tb_center b ON a.CENTER_ID = b.CENTER_SN
      WHERE a.EMAIL = '${id}' AND a.PASSWORD = '${pw}'
      LIMIT 1;
    `, (err, result) => {
      db.end();
      if (err || result?.length === 0) {
        console.log(err);
        req.session.isLogin = null;
        res.send(fail('일치하는 관리자가 없습니다.'));
        return;
      }
      req.session.isLogin = {...result[0], IS_ADMIN: true};
      res.send(success(req.session.isLogin));
    });
  })
}
// 공지사항 수정
module.exports.putNotice = (req, res) => {
  log(req);
  let data = req?.body;
  if (!data?.id) return res.send(fail('수정할 데이터가 없습니다.'));

  dbConnect(db => {
    db.query(`
      UPDATE tn_notice SET 
      NTC_TTL = '${data?.title}',
      NTC_CTNT = '${data?.contents}',
      TYPE = ${data?.isAdminNotice}
      WHERE NTC_SN = ${data?.id}
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('공지 수정에 실패하였습니다.'));
        return;
      }
      res.send(success(data?.id));
    })
  })
}
// 공지사항 삭제
module.exports.deleteNotice = (req, res) => {
  log(req);
  let idArr = req?.body?.idArr ?? [];
  if (idArr?.length === 0) return res.send(fail('삭제할 항목이 없습니다.'));
  let query = idArr.map(x => 'NTC_SN = ' + x);
  query = query.join(' OR ');
  dbConnect(db => {
    db.query(`
      DELETE FROM tn_notice WHERE ${query};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('공지 삭제를 실패하였습니다.'));
        return;
      }
      res.send(success(null));
    })
  })
}
// 회원리스트 조회
module.exports.getMember = (req, res) => {
  log(req);
  let centerId = req?.session?.isLogin?.CENTER_ID;
  let searchText = req?.query?.q ?? '';
  
  dbConnect(db => {
    db.query(`
      SELECT ${userSelectQuery}
      FROM tn_user a
      WHERE a.IS_DELETE = 0 AND
            a.CENTER_SN = '${centerId}' AND 
            a.USER_NM LIKE '%${searchText}%'
      ORDER BY a.CRT_DT DESC;

      SELECT
      a.ID, a.USER_ID, a.REMAIN_COUNT, a.REMAIN_DATE, b.USE_TYPE,
      DATE_FORMAT(a.BUY_DT, '%Y-%m-%d %H:%i:%s') AS BUY_DATE
      FROM tn_user_voucher a
      LEFT JOIN tn_voucher b ON a.VOUCHER_ID = b.ID;
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('회원 리스트를 불러오는데 실패하였습니다.'));
        return;
      }

      let userList = result[0];
      let voucherList = result[1];
      let send = userList?.map(item => ({ 
        ...item, 
        VOUCHER: voucherList?.filter(x => x?.USER_ID === item?.ID)
      }));

      res.send(success(send));
    });
  })
}
// 회원정보 상세조회
module.exports.getMemberDetail = (req, res) => {
  log(req);
  let centerId = req?.session?.isLogin?.CENTER_ID;
  let id = req?.params?.id;
  
  dbConnect(db => {
    db.query(`
      SELECT ${userSelectQuery}
      FROM tn_user
      WHERE CENTER_SN = '${centerId}' AND 
            USER_SN = '${id}';
    `, (err, result) => {
      db.end();
      if (err || !result[0]) {
        console.log(err);
        res.send(fail('회원 정보를 불러오는데 실패하였습니다.'));
        return;
      }
      res.send(success(result[0]));
    });
  })
}
// 회원정보 삭제
module.exports.deleteMember = (req, res) => {
  let idArr = req?.body?.idArr ?? [];
  if (idArr?.length === 0) return res.send(fail('삭제할 항목이 없습니다.'));
  let query = idArr.map(x => 'USER_SN = ' + x);
  query = query.join(' OR ');
  dbConnect(db => {
    db.query(`
      UPDATE tn_user SET IS_DELETE = 1 WHERE ${query};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('회원 삭제를 실패하였습니다.'));
        return;
      }
      res.send(success(null));
    })
  })
}
// 이용권, 이용권 카테고리 리스트 조회
module.exports.getVoucher = (req, res) => {
  log(req);
  let searchText = req?.query?.q ?? '';

  dbConnect(db => {
    db.query(`
      SELECT ID, NAME, 'ORDER' 
      FROM tn_voucher_category 
      ORDER BY 'ORDER' ASC, ID ASC;

      SELECT
      a.ID, a.CATEGORY_ID, a.NAME, a.PLACE, 
      a.USE_TYPE, b.NAME AS USE_TYPE_NAME, a.USE_COUNT, a.USE_DAY
      FROM tn_voucher a
      LEFT JOIN tn_common b ON b.CODE = a.USE_TYPE AND b.BASE_ID = 4
      WHERE a.NAME LIKE '%${searchText}%';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('이용권 리스트 조회를 실패하였습니다.'));
        return;
      }

      let categoryList = result[0];
      let voucherList = result[1];
      let send = categoryList.map(item => ({
        ...item, VOUCHER: voucherList.filter(x => x?.CATEGORY_ID === item?.ID)
      }));
      
      res.send(success(send));
    });
  })
}
// 이용권 정보 조회
module.exports.getVoucherDetail = (req, res) => {
  log(req);
  let voucherId = req?.params?.id;
  if (!voucherId) return res.send(fail('이용권 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT
      a.ID, a.NAME, a.PLACE, a.USE_TYPE, 
      a.USE_COUNT, a.USE_DAY, b.NAME AS CATEGORY_NAME
      FROM tn_voucher a
      LEFT JOIN tn_voucher_category b ON a.CATEGORY_ID = b.ID
      WHERE a.ID = '${voucherId}';
    `, (err, result) => {
      db.end();
      if (err || !result[0]) {
        console.log(err);
        res.send(fail('이용권 정보 조회를 실패하였습니다.'));
        return;
      }
      
      res.send(success(result[0]));
    });
  })
}
// 테스트 플래그 수정
module.exports.putChangeTestFlag = (req, res) => {
  log(req);
  let userId = req?.body?.userId;
  let flag = req?.body?.flag;
  if (!userId) return res.send(fail('유저 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      UPDATE tn_user
      SET TEST_FLAG = ${flag} 
      WHERE USER_SN = ${userId};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('저장에 실패하였습니다.'));
        return;
      }
      res.send(success(null));
    })
  })
}
// 회원 정보 수정
module.exports.putMemberModify = (req, res) => {
  log(req);
  let userId = req?.body?.ID;
  let name = req?.body?.NAME;
  let gender = req?.body?.GENDER;
  let birth = req?.body?.BIRTH;
  let email = req?.body?.EMAIL;
  let height = req?.body?.HEIGHT;
  let weight = req?.body?.WEIGHT;
  let schoolName = req?.body?.SCHOOL_NAME;

  if (!userId) return res.send(fail('유저 아이디가 없습니다.'));
  if (!name || !email || !height || !weight || !schoolName) return res.send(fail('수정 데이터가 없습니다.'));
  
  dbConnect(db => {
    db.query(`
      UPDATE tn_user SET
      USER_NM = '${name}', EMAIL = '${email}',
      BIRTH = '${birth}', GNDR = '${gender}',
      HGHT = '${height}', WGHT = '${weight}',
      OGDP = '${schoolName}'
      WHERE USER_SN = '${userId}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('수정에 실패했습니다.'));
        return;
      }
      res.send(success(null));
    })
  })
}
// 회원 이용권 리스트 조회
module.exports.getUserVoucher = (req, res) => {
  log(req);
  let userId = req?.params?.id;
  if (!userId) return res.send(fail('유저 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT
      a.ID, b.ID AS VOUCHER_ID,a.REMAIN_COUNT, a.REMAIN_DATE, a.STATUS,
      DATE_FORMAT(a.BUY_DT, '%Y-%m-%d %H:%i:%s') AS BUY_DT,
      b.CATEGORY_ID, c.NAME AS CATEGORY_NAME, 
      b.NAME, b.PLACE, b.USE_TYPE, b.USE_COUNT, b.USE_DAY
      FROM tn_user_voucher a
      LEFT JOIN tn_voucher b ON a.VOUCHER_ID = b.ID
      LEFT JOIN tn_voucher_category c ON b.CATEGORY_ID = c.ID
      WHERE a.USER_ID = ${userId};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('유저 이용권 정보 조회에 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 회원 메모 리스트 조회
module.exports.getUserMemo = (req, res) => {
  log(req);
  let userId = req?.params?.id;
  if (!userId) return res.send(fail('유저 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT
      ID, USER_ID, MEMO, IS_UPDATE,
      DATE_FORMAT(CREATE_DT, '%Y-%m-%d %H:%i:%s') AS CREATE_DT,
      DATE_FORMAT(MODIFY_DT, '%Y-%m-%d %H:%i:%s') AS MODIFY_DT
      FROM tn_user_memo
      WHERE USER_ID = ${userId}
      ORDER BY CREATE_DT ASC;
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('유저 메모 리스트 조회에 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 회원 메모 저장
module.exports.postUserMemo = (req, res) => {
  log(req);
  let userId = req?.params?.id;
  let value = req?.body?.value;
  if (!userId) return res.send(fail('유저 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      INSERT INTO tn_user_memo
      (USER_ID, MEMO)
      VALUES
      ('${userId}', '${value}');
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('리스트 조회에 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 회원 메모 수정
module.exports.putUserMemo = (req, res) => {
  log(req);
  let memoId = req?.params?.memoId;
  let value = req?.body?.value;
  if (!memoId) return res.send(fail('메모 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      UPDATE tn_user_memo SET
      MEMO = '${value}', IS_UPDATE = 1
      WHERE ID = ${memoId};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('수정에 실패하였습니다.'));
        return;
      }
      res.send(success(null));
    })
  })
}
// 회원 메모 삭제
module.exports.deleteUserMemo = (req, res) => {
  log(req);
  let memoId = req?.params?.memoId;
  if (!memoId) return res.send(fail('메모 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      DELETE FROM tn_user_memo WHERE ID = ${memoId};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('삭제에 실패하였습니다.'));
        return;
      }
      res.send(success(null));
    })
  })
}
// 회원 히스토리 조회
module.exports.getUserHistory = (req, res) => {
  log(req);
  let userId = req?.params?.id;
  if (!userId) return res.send(fail('회원 아이디가 없습니다.'));
  
  dbConnect(db => {
    db.query(`
      SELECT
      ID, USER_ID, HISTORY,
      DATE_FORMAT(CREATE_DT, '%Y-%m-%d %H:%i:%s') AS CREATE_DT
      FROM tn_user_history 
      WHERE USER_ID = '${userId}'
      ORDER BY CREATE_DT ASC;
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('조회에 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 회원 이용권 정지/재개
module.exports.putUserVoucherStatus = (req, res) => {
  log(req);
  let userVoucherId = req?.params?.userVoucherId;
  let status = req?.body?.status;
  if (!userVoucherId) return res.send(fail('회원의 이용권 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      UPDATE tn_user_voucher
      SET STATUS = '${status}'
      WHERE ID = '${userVoucherId}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail((status === 1 ? '재개' : '정지') + '에 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 회원 리스트 다운로드 (엑셀)
module.exports.memberListDownload = (req, res) => {
  log(req);
  let centerId = req.session?.isLogin?.CENTER_ID;
  let centerName = req.session?.isLogin?.CENTER_NAME;
  if (!centerId || !centerName) return res.send(fail('센터 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT ${userSelectQuery} FROM tn_user 
      WHERE CENTER_SN = '${centerId}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('회원 리스트를 조회하는데 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 선생님 리스트
module.exports.getTeacher = (req, res) => {
  log(req);
  let centerId = req?.session?.isLogin?.CENTER_ID;
  if (!centerId) return res.send(fail('센터 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT
      a.ID, a.NAME, b.CENTER_NM AS CENTER_NAME, a.PHONE, a.EMAIL, a.GENDER, a.IMAGE_PATH AS IMG,
      DATE_FORMAT(a.CREATE_DT, '%Y-%m-%d %H:%i:%s') AS DATE,
      DATE_FORMAT(a.MODIFY_DT, '%Y-%m-%d %H:%i:%s') AS MODIFY_DATE
      FROM tn_admin a
      LEFT JOIN tb_center b ON a.CENTER_ID = b.CENTER_SN
      WHERE a.CENTER_ID = '${centerId}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('선생님 리스트 조회에 실패하였습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 선생님 상세정보 조회
module.exports.getTeacherDetail = (req, res) => {
  log(req);
  let teacherId = req?.params?.id;
  let centerId = req?.session?.isLogin?.CENTER_ID;
  if (!teacherId) return res.send(fail('선생님 아이디가 없습니다.'));
  if (!centerId) return res.send(fail('센터 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT
      a.ID, a.NAME, b.CENTER_NM AS CENTER_NAME, a.PHONE, a.EMAIL, a.GENDER, a.IMAGE_PATH AS IMG,
      DATE_FORMAT(a.CREATE_DT, '%Y-%m-%d %H:%i:%s') AS DATE,
      DATE_FORMAT(a.MODIFY_DT, '%Y-%m-%d %H:%i:%s') AS MODIFY_DATE
      FROM tn_admin a
      LEFT JOIN tb_center b ON a.CENTER_ID = b.CENTER_SN
      WHERE a.ID = '${teacherId}' AND a.CENTER_ID = '${centerId}';
    `, (err, result) => {
      db.end();
      if (err || !result[0]) {
        err && console.log(err);
        res.send(fail('선생님 정보 조회에 실패하였습니다.'));
        return;
      }
      res.send(success(result[0]));
    })
  })
}
// 회원 기본 메모 수정
module.exports.putUserDefaultMemo = (req, res) => {
  log(req);
  let userId = req?.params?.id;
  let memo = req?.body?.memo;
  if (!userId) return res.send(fail('회원의 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      UPDATE tn_user 
      SET MEMO = '${memo}'
      WHERE USER_SN = '${userId}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('메모 저장에 실패하였습니다.'));
        return;
      }
      res.send(success(memo));
    })
  })
}
// 입출금 리스트 조회
module.exports.getAccount = (req, res) => {
  log(req);
  let centerId = req?.session?.isLogin?.CENTER_ID;
  let searchText = req?.query?.q ?? '';
  if (!centerId) return res.send(fail('입출금 내역 조회에 실패하였습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT
      a.ID, a.IS_AUTO, a.CATEGORY, b.NAME AS CATEGORY_NAME, a.DESCRIPTION, a.MONEY_TYPE, a.MONEY,
      DATE_FORMAT(a.CREATE_DT, '%Y-%m-%d %H:%i:%s') AS CREATE_DATE
      FROM tn_account a
      LEFT JOIN tn_common b ON b.CODE = a.CATEGORY AND b.BASE_ID = 2
      WHERE a.CENTER_ID = '${centerId}' AND 
      a.IS_DELETE = 0 AND
      a.DESCRIPTION LIKE '%${searchText}%'
      ORDER BY a.CREATE_DT DESC;
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        return res.send(fail('입출금 내역 조회에 실패하였습니다.'));
      }
      res.send(success(result));
    })
  })
}
// 입출금 내역 정보 조회
module.exports.getAccountDetail = (req, res) => {
  log(req);
  let accountId = req?.params?.id;
  if (!accountId) return res.send(fail('입출금 내역 아이디가 없습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT CODE AS ID, NAME FROM tn_common WHERE BASE_ID = 2;

      SELECT
      ID, CATEGORY, DESCRIPTION, MONEY_TYPE, MONEY,
      DATE_FORMAT(CREATE_DT, '%Y-%m-%d %H:%i:%s') AS CREATE_DATE
      FROM tn_account
      WHERE ID = '${accountId}' AND 
      IS_DELETE = 0 AND IS_AUTO = 0;
    `, (err, result) => {
      db.end();
      if (err || !result[1][0]) {
        err && console.log(err);
        return res.send(fail('입출금 내역 정보 조회에 실패하였습니다.'));
      }
      res.send(success({ type: result[0], info: result[1][0] }));
    })
  })
}
// 입출금내역 삭제
module.exports.deleteAccount = (req, res) => {
  log(req);
  let idArr = req?.body?.idArr ?? [];
  if (idArr?.length === 0) return res.send(fail('삭제할 항목이 없습니다.'));
  let query = idArr.map(x => 'ID = ' + x);
  query = query.join(' OR ');
  dbConnect(db => {
    db.query(`
      UPDATE tn_account SET IS_DELETE = 1 WHERE ${query};
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('입출금내역 삭제를 실패하였습니다.'));
        return;
      }
      res.send(success(null));
    })
  })
}
// 입출금내역 수정
module.exports.putAccount = (req, res) => {
  log(req);
  let data = req?.body?.data;
  if (!data) return res.send(fail('입출금내역 수정에 실패하였습니다.'));

  res.send(success(data));
}
// Common Code
module.exports.getCommonCode = (req, res) => {
  let BASE_ID = req?.params?.id;
  dbConnect(db => {
    db.query(`
      SELECT
      CODE AS ID, NAME, DESCRIPTION
      FROM tn_common
      WHERE BASE_ID = '${BASE_ID}'
      ORDER BY CODE ASC;
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        res.send(fail('공통코드가 없습니다.'));
        return;
      }
      res.send(success(result));
    })
  })
}
// 이용권 추가
module.exports.postVoucher = (req, res) => {
  log(req);
  let data = req?.body?.data;
  let centerId = req?.session?.isLogin?.CENTER_ID;
  if (!data || !centerId) return res.send(fail('이용권 저장에 실패하였습니다.'));

  dbConnect(db => {
    db.query(`
      INSERT INTO tn_voucher
      (CENTER_ID, CATEGORY_ID, NAME, PLACE, USE_TYPE, USE_COUNT, USE_DAY)
      VALUES
      (
        '${centerId}', '${data?.CATEGORY_ID}', '${data?.NAME}', 
        '${data?.PLACE}', '${data?.USE_TYPE}', 
        ${data?.USE_TYPE === 1 ? data?.USE_COUNT : null}, 
        ${data?.USE_DAY}
      );
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        return res.send(fail('이용권 저장에 실패하였습니다.'));
      }
      res.send(success(null));
    })
  })
}
// 이용권 삭제
module.exports.deleteVoucher = (req, res) => {
  log(req);
  let id = req?.params?.id;
  if (!id) return res.send(fail('이용권 삭제에 실패하였습니다.'));

  dbConnect(db => {
    db.query(`
      DELETE FROM tn_voucher WHERE ID = '${id}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        return res.send(fail('이용권 삭제에 실패하였습니다.'));
      }
      res.send(success(null));
    })
  })
}
// 이용권 카테고리 삭제
module.exports.deleteVoucherCategory = (req, res) => {
  log(req);
  let id = req?.params?.id;
  if (!id) return res.send(fail('이용권 카테고리 삭제에 실패하였습니다.'));

  dbConnect(db => {
    db.query(`
      DELETE FROM tn_voucher_category WHERE ID = '${id}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        return res.send(fail('이용권 카테고리 삭제에 실패하였습니다.'));
      }
      res.send(success(null));
    })
  })
}
// 이용권 카테고리 추가
module.exports.postVoucherCategory = (req, res) => {
  log(req);
  let data = req?.body?.data;
  let centerId = req?.session?.isLogin?.CENTER_ID;
  if (!data || !centerId) return res.send(fail('카테고리 추가에 실패하였습니다.'));

  dbConnect(db => {
    db.query(`
      INSERT INTO tn_voucher_category
      (CENTER_ID, NAME)
      VALUES
      ('${centerId}', '${data?.NAME}');
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        return res.send(fail('카테고리 추가에 실패하였습니다.'));
      }
      res.send(success(null));
    })
  })
}
// 이용권 정보 수정
module.exports.putVoucher = (req, res) => {
  log(req);
  let id = req?.params?.id;
  let data = req?.body?.data;
  if (!id || !data) return res.send(fail('이용권 수정에 실패하였습니다.'));

  dbConnect(db => {
    db.query(`
      UPDATE tn_voucher SET
      NAME = '${data?.NAME}', PLACE = '${data?.PLACE}', USE_TYPE = '${data?.USE_TYPE}',
      USE_DAY = '${data?.USE_DAY}', USE_COUNT = '${data?.USE_COUNT}'
      WHERE ID = '${id}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        return res.send(fail('이용권 수정에 실패하였습니다.'));
      }
      res.send(success(null));
    })
  })
}
// 이용권 카테고리 이름 변경
module.exports.putVoucherCategory = (req, res) => {
  log(req);
  let id = req?.params?.id;
  let name = req?.body?.name;
  if (!id || !name) return res.send(fail('카테고리 이름 변경에 실패하였습니다.'));

  dbConnect(db => {
    db.query(`
      UPDATE tn_voucher_category SET
      NAME = '${name}'
      WHERE ID = '${id}';
    `, (err, result) => {
      db.end();
      if (err) {
        console.log(err);
        return res.send(fail('이용권 수정에 실패하였습니다.'));
      }
      res.send(success(null));
    })
  })
}