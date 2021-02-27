import http from './http.js'

let BASE_URL =
  process.env.NODE_ENV === 'production' ? '/samescreen/' : 'http://localhost:8001/samescreen/'

export function getConfig() {
  let url = BASE_URL + 'config/config.json'
  return http.get(url, {
    t: new Date().getTime(),
  })
}

export function getSayOption() {
  return http.addCache('__sayoption', () => {
    let url = BASE_URL + 'config/sayoption.json'
    return http.get(url, {
      t: new Date().getTime(),
    })
  })
}

export function getInterfaces() {
  return http.addCache('__interface', () => {
    let url = BASE_URL + 'config/interface.json'
    return http.get(url, {
      t: new Date().getTime(),
    })
  })
}

export function getPermission() {
  return http.addCache('__permission', () => {
    let url = BASE_URL + 'config/permission.json'
    console.log(333, url)
    return http.get(url, {
      t: new Date().getTime(),
    })
  })
}
