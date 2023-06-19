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
    // return Promise.reject(`Error: ${res.status}`)
    return res.json().then((err) => Promise.reject(err))
  }

  _request(url, options) {
    return fetch(url, {
      credentials: this._credentials,
      ...options,
    }).then(this._getJson)
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
    })
  }

  logout() {
    return this._request(`${this._baseUrl}/logout`, {
      method: 'GET',
      headers: this._headers,
    })
  }

  checkToken(token) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
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
