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

// 세션확인
module.exports.isSession = (req, res) => {
  let isSession = req?.session?.isLogin;
  if (!isSession) return res.send(fail('세션이 만료되었습니다.'));
  res.send(success(req?.session?.isLogin));
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
      WHERE EMAIL = '${email}' AND 
      AUTH_ID = '${authId}'
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
  let ID = data?.ID;
  let EMAIL = data?.EMAIL;
  let CENTER_ID = data?.CENTER_ID;
  let AUTH_ID = data?.AUTH_ID;
  console.log(data);
  if (!ID || !EMAIL || !CENTER_ID || !AUTH_ID) {
    console.log('회원 정보가 없습니다.');
    res.send(fail('회원 정보가 없습니다.'));
    return;
  }

  dbConnect(db => {
    db.query(`
      SELECT ${userSelectQuery} FROM tn_user 
      WHERE USER_SN = '${ID}' AND EMAIL = '${EMAIL}' AND 
      AUTH_ID = '${AUTH_ID}' AND CENTER_SN = '${CENTER_ID}';
    `, (err, result) => {
      if (err) {
        db.end();
        console.log(err);
        res.send(fail('로그인 실패'));
        return;
      }
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
// 종합결과
module.exports.getTotalResult = (req, res) => {
  dbConnect(db => {
    db.query(`
      SELECT * FROM
      tn_test_tp
    `, (err, result) => {
      db.end();
      if (err) return res.send(fail('종합결과를 불러오는데 실패하였습니다.'));
      res.send(success(result));
    });
  })
}
// 검사 별 상세 결과
module.exports.getDetailResult = (req, res) => {
  let id = req.params?.id;
  let resultData = {};

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
      console.log(result);
      if (err || result.length === 0) {
        res.send(fail('해당 검사정보가 없습니다.'));
        db.end();
        return;
      }
      resultData.info = result[0];

      db.query(`
        SELECT 
        DCSN_SN AS ID,
        DCSN_NM AS NAME,
        DCSN_DSCRT AS DESCRIPTION
        FROM
        tn_test_dcsn
        WHERE TEST_TP_SN = '${id}'
      `, (err, result) => {
        resultData.description = err ? [] : result;
        db.end();
        res.send(success(resultData));
      });
    })
  });
}
// 신규 검사
module.exports.getDoSurvey = (req, res) => {
  let id = req?.params?.id;
  if (!id) return res.send(fail('검사 ID가 없습니다.'));

  dbConnect(db => {
    db.query(`
      SELECT
      *
      FROM
      tn_test_tp a
      WHERE a.TEST_TP_SN = '${id}'
    `, (err, result) => {
      if (err || result.length === 0) {
        db.end();
        console.log(err);
        res.send(fail('검사정보가 존재하지 않습니다.'));
        return;
      }
      db.end();
      res.send(success(result[0]));
    });
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