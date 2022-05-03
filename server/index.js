// 모듈, 상수 선언
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const conf = require('./config.json');
const app = express();
const basePath = __dirname + '/../build';

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
  rolling : true,
  store: new MySQLStore(conf.db),
}));

// 라우터
const pages = [
  '/', 
  '/login', 
  '/join', 
  '/totalresult/:id', 
  '/survey/:id', 
  '/survey/:id/new', 
  '/notice', 
  '/noice/:id',
  '/duplicate',
  '/terms',
];
pages.forEach(page => app.use(page, express.static(basePath)));

// API
const {
  join,
  snsLogin,
  login, 
  logout, 
  isSession, 
  getCenter,
  getTotalResult,
  getDetailResult,
  getDoSurvey,
  getNotice,
  getNoticeDetail,
} = require('./api');
app.get('/api/isSession', isSession);
app.post('/api/join', join);
app.post('/api/snsLogin', snsLogin);
app.post('/api/login', login);
app.get('/api/logout', logout);
app.get('/api/center', getCenter);
app.get('/api/totalResult', getTotalResult);
app.get('/api/detailResult/:id', getDetailResult);
app.get('/api/doSurvey/:id', getDoSurvey);
app.get('/api/notice', getNotice);
app.get('/api/notice/:id', getNoticeDetail);

// 서버 시작
app.listen(80);