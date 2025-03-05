class SessionToken {
  constructor() {
    this.token = this.getToken();
  }

  getToken() {
    return localStorage.getItem("token") || null;
  }

  saveToken(userToken) {
    localStorage.setItem("token", userToken);
    this.token = userToken;
  }

  removeToken() {
    localStorage.removeItem("token");
    this.token = null;
  }
}

export default new SessionToken();
