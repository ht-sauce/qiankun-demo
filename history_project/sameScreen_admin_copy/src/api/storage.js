export default {
  setUserInfo(user) {
    if (!user) return
    let info = this.getUserInfo()
    if (info) {
      Object.assign(info, user)
    } else {
      info = user
    }
    sessionStorage.setItem('__user', typeof user == 'object' ? JSON.stringify(info) : info)
  },
  getUserInfo(key) {
    let _user = sessionStorage.getItem('__user')
    const userObj = _user && _user != 'null' ? JSON.parse(_user) : null
    if (!key) {
      return userObj
    }
    return userObj ? userObj[key] : ''
  },
  getCorpId() {
    return this.getUserInfo('corpid')
  },
  getToken() {
    return this.getUserInfo('token')
  },
  getPermission() {
    let _p = sessionStorage.getItem('__permission')
    return _p && _p != 'null' ? JSON.parse(_p) : null
  },
  setPermission(permission) {
    sessionStorage.setItem(
      '__permission',
      typeof permission == 'object' ? JSON.stringify(permission) : permission,
    )
  },
  setInteractiveCondition(condition) {
    localStorage.setItem(
      '__interactive_condition',
      typeof condition == 'object' ? JSON.stringify(condition) : condition,
    )
  },
  getInteractiveCondition() {
    let _condition = localStorage.getItem('__interactive_condition')
    const condition = _condition && _condition != 'null' ? JSON.parse(_condition) : null
    return condition
  },
  setOverviewCondition(condition) {
    localStorage.setItem(
      '__overview_condition',
      typeof condition == 'object' ? JSON.stringify(condition) : condition,
    )
  },
  getOverviewCondition() {
    let _condition = localStorage.getItem('__overview_condition')
    const condition = _condition && _condition != 'null' ? JSON.parse(_condition) : null
    return condition
  },
  destory() {
    sessionStorage.removeItem('__user')
    //jsondata.js 请求的数据
    sessionStorage.removeItem('__interface')
    sessionStorage.removeItem('__sayoption')
    sessionStorage.removeItem('__permission')
  },
}
