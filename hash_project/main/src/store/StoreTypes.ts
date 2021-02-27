interface Services {
  userApi: string
}

interface StateType {
  production: boolean
  user: {
    token: string
    info: any
    orgid: number | null
  }
  configTiny: {
    userAuth: {
      [key: string]: string
    }
  }
  lang: string
  services: Services
}

export { StateType, Services }
