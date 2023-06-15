class AuthApi {
  constructor(options) {
    this._baseUrl = options.baseUrl
    this._headers = options.headers
    this._credentials = options.credentials
  }

  _getJson(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Error: ${res.status}`)
  }

  _request(url, options) {
    return fetch(url, options).then(this._getJson)
  }

  register(data) {
    return this._request(`${this._baseUrl}/signup`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
  }

  login(data) {
    return this._request(`${this._baseUrl}/signin`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
      credentials: this._credentials,
    })
  }

  checkToken(token) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
      credentials: this._credentials,
    })
  }
}

const authApi = new AuthApi({
  baseUrl: 'https://api.mesto-app.nomoredomains.rocks',
  // baseUrl: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
})

export default authApi
