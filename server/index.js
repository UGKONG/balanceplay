// 모듈, 상수 선언
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const conf = require('./config.json');
const app = express();
const basePath = __dirname + '/../build';
const PORT = 8080;

// 엔진 셋팅
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: 'balanceplay',  // 암호화
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000,  // 1시간 세션유지
  },
  rolling: true,
  store: new MySQLStore(conf.db),
}));

// 회원용 라우터
const memberPages = [
  '/',
  '/dev',
  '/login',
  '/join',
  '/totalresult/:id',
  '/survey/:id',
  '/survey/:id/new',
  '/survey/:id/readOnly',
  '/notice',
  '/notice/:id',
  '/duplicate',
  '/terms',
  '/testInformation',
  '/myInfo',
  '/myJoinData',
  '/info',
  '/info/term',
  '/mySchedule',
];
memberPages.forEach(page => app.use(page, express.static(basePath)));

// 관리자용 라우터
const adminPages = [
  '/',
  '/login',
  '/member',
  '/member/new',
  '/member/:id',
  '/test/:id',
  '/test/:id/new',
  '/notice',
  '/notice/new',
  '/notice/:id',
  '/noticeModify/:id',
  '/schedule',
  '/voucher',
  '/account',
  '/account/new',
  '/accountModify/:id',
  '/history',
  '/teacher',
  '/teacher/:id',
  '/setting',
  '/payment',
];
adminPages.forEach(page => app.use('/admin' + page, express.static(basePath + '/admin')));

// API
const {
  getOtherList,
  getOtherData,
  getLog,
  getMenu,
  devLogin,
  getIp,
  guestLogin,
  join,
  snsLogin,
  login,
  logout,
  isSession,
  getCenter,
  getCenterDetail,
  getTotalResult,
  getDetailResult,
  getDoSurvey,
  postDoSurvey,
  getNotice,
  postNotice,
  putNotice,
  deleteNotice,
  getNoticeDetail,
  getTestInformation,
  getMyTestList,
  getSurveyResult,
  getMyInfo,
  putMyInfo,
  deleteMyInfo,
  postMyFamilyInfo,
  putMyFamilyInfo,
  deleteMyFamilyInfo,

  adminLogin,
  getMember,
  getMemberDetail,
  deleteMember,
  getVoucher,
  getVoucherDetail,
  putChangeTestFlag,
  putMemberModify,
  getUserVoucher,
  getUserMemo,
  postUserMemo,
  putUserMemo,
  deleteUserMemo,
  getUserHistory,
  putUserVoucherStatus,
  memberListDownload,
  getTeacher,
  getTeacherDetail,
  putUserDefaultMemo,
  getAccount,
  deleteAccount,
  getAccountDetail,
  postAccount,
  putAccount,
  getCommonCode,
  postVoucher,
  deleteVoucher,
  deleteVoucherCategory,
  postVoucherCategory,
  putVoucher,
  putVoucherCategory,
  getScheduleInit,
  getCalendar,
  getRoom,
  getAccountCategory,
  getMemberTest,
  getMemberTestResult,
  getPayment,
  postPayment,
  getSetting,
} = require('./api');

app.get('/api/menu/:id', getMenu);
app.get('/api/log', getLog);
app.get('/api/devLogin', devLogin);
app.get('/api/ip', getIp);
app.post('/api/guestLogin', guestLogin);
app.get('/api/isSession', isSession);
app.post('/api/join', join);
app.post('/api/snsLogin', snsLogin);
app.post('/api/login', login);
app.get('/api/logout', logout);
app.get('/api/center', getCenter);
app.get('/api/centerDetail', getCenterDetail);
app.get('/api/testInformation', getTestInformation);
app.get('/api/myTestList', getMyTestList);
app.get('/api/totalResult/:id', getTotalResult);
app.get('/api/detailResult/:id', getDetailResult);
app.get('/api/doSurvey/:id', getDoSurvey);
app.post('/api/doSurvey/:id', postDoSurvey);
app.get('/api/notice', getNotice);
app.post('/api/notice', postNotice);
app.put('/api/notice', putNotice);
app.delete('/api/notice', deleteNotice);
app.get('/api/notice/:id', getNoticeDetail);
app.get('/api/surveyResult/:id', getSurveyResult);
app.get('/api/myinfo', getMyInfo);
app.put('/api/myinfo', putMyInfo);
app.delete('/api/myinfo/:id', deleteMyInfo);
app.post('/api/myFamilyInfo/:id', postMyFamilyInfo);
app.put('/api/myFamilyInfo', putMyFamilyInfo);
app.delete('/api/myFamilyInfo/:id', deleteMyFamilyInfo);
app.post('/api/adminLogin', adminLogin);
app.get('/api/member', getMember);
app.get('/api/member/:id', getMemberDetail);
app.delete('/api/member', deleteMember);
app.get('/api/voucher', getVoucher);
app.get('/api/voucher/:id', getVoucherDetail);
app.put('/api/changeTestFlag', putChangeTestFlag);
app.put('/api/memberModify', putMemberModify);
app.get('/api/userVoucher/:id', getUserVoucher);
app.put('/api/userVoucher/:userVoucherId', putUserVoucherStatus);
app.get('/api/userMemo/:id', getUserMemo);
app.post('/api/userMemo/:id', postUserMemo);
app.put('/api/userMemo/:memoId', putUserMemo);
app.delete('/api/userMemo/:memoId', deleteUserMemo);
app.get('/api/userHistory/:id', getUserHistory);
app.get('/api/memberListDownload', memberListDownload);
app.get('/api/teacher', getTeacher);
app.get('/api/teacher/:id', getTeacherDetail);
app.put('/api/userDefaultMemo/:id', putUserDefaultMemo);
app.get('/api/accountCategory', getAccountCategory);
app.get('/api/account', getAccount);
app.get('/api/account/:id', getAccountDetail);
app.delete('/api/account', deleteAccount);
app.put('/api/account', putAccount);
app.post('/api/account', postAccount);
app.get('/api/common/:id', getCommonCode);
app.post('/api/voucher', postVoucher);
app.delete('/api/voucher/:id', deleteVoucher);
app.put('/api/voucher/:id', putVoucher);
app.delete('/api/voucherCategory/:id', deleteVoucherCategory);
app.post('/api/voucherCategory', postVoucherCategory);
app.put('/api/voucherCategory/:id', putVoucherCategory);
app.get('/api/scheduleInit', getScheduleInit);
app.get('/api/setting', getSetting);
app.get('/api/calendar', getCalendar);
app.get('/api/room', getRoom);
app.get('/api/memberTest/:id', getMemberTest);
app.get('/api/memberTestResult/:testId', getMemberTestResult);
app.get('/api/payment/:userId/:voucherId', getPayment);
app.post('/api/payment', postPayment);

app.get('/api/:table', getOtherList);
app.get('/api/:table/:id', getOtherData);

// 서버 시작
app.listen(PORT,
  () => console.log(`

┌────── Server Start!! ────┐
│ PROTOCOL: http           │
│ HOST: localhost          │
│ PORT: ${PORT}               │
│ http://localhost:${PORT}    │
└──────────────────────────┘

  `)
);