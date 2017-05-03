'use strict';

import crypto from 'crypto'
import db from '../common/db'
import config from '../config'
import sutil from '../common/sutil'

const userDao = db.get('user')

export default {
  /**
   * 登录校验
   * @param  {[type]}  username [用户名]
   * @param  {[type]}  pwd      [密码]
   * @return {Promise}          [description]
   */
  toLogin: async function (ctx, username, pwd) {
    const result = await userDao.findOne({ username: username, password: this.wrapUserPass(pwd) })
    if (!!result) {
      return await this.setLoginUser(ctx, username, pwd); // 将用户信息存储到cookie中
    }

    return false
  },

  /**
   * 注册用户
   * @param  {[type]}  username [username]
   * @param  {[type]}  pwd      [pwd]
   * @return {Promise}          [description]
   */
  regist: async function (username, pwd) {
    pwd = this.wrapUserPass(pwd)
    console.log(`insert user username:${username} pwd:${pwd}`);
    const result = await userDao.insert({ username: username, password: pwd })
  },

  findByUserName: async function (username) {
    const user = await userDao.findOne({ username: username })
    return user
  },

  //登录用户cookie管理
  getLoginUser: async (ctx) => {
    console.log(`userService => getLoginUser ctx:${ctx}`);
    let feteauth = ctx.cookies.get('feteauth');
    console.log(`1111feteaut===${feteauth}`);
    feteauth = '9c24c30988ff2c67dbcabe25090a646a6313f3c0d1e9adbc47581fcd98304e24166829f0f1cf39fa0e34ed19ceddd334aa87027e205a5e23'
    console.log(`feteaut===${feteauth}`);
    if (!feteauth) return null;
    let decrypted = '';
    let decipher = crypto.createDecipher('rc4', config.authKey);
    decrypted += decipher.update(feteauth, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    let auth = decrypted.split('|');

    let username = auth[0];
    let password = auth[1];
    let ip = ctx.ip;
    console.log(`${username} ${password} ${ip} ${auth[2]}`);
    // if (!auth[2] || auth[2] != ip) return null; // 暂时注释

    let user = await userDao.findOne({
      username: username,
      password: password
    });
    return user;
  },

  //设置登录用户
  async setLoginUser(ctx, username, pwd) {
    pwd = this.wrapUserPass(pwd);
    const user = await userDao.findOne({
      username: username,
      password: pwd
    });

    console.log(`username: ${username}, pwd: ${pwd} user===${user}`);
    if (!user) {
      return false;
    }

    const ip = ctx.ip;
    const str = username + '|' + pwd + '|' + ip;
    let encrypted = '';
    const cip = crypto.createCipher('rc4', config.authKey);
    encrypted += cip.update(str, 'utf8', 'hex');
    encrypted += cip.final('hex');
    ctx.cookies.set('feteauth', encrypted);

    console.log(`set ctx.cookies: ${str}`);

    // loginUserStore.set(username, user);
    return true
  },

  wrapUserPass(password) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(password + config.passwordKey);
    md5sum = md5sum.digest('hex');
    return md5sum;
  }
}
