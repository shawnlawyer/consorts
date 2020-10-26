import auth0 from 'auth0-js';

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      audience: process.env.REACT_APP_AUTH0_API_AUDIENCE,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: window.location.origin + '/callback',
      responseType: 'token id_token',
      scope: 'openid profile'
    });
    /*  read:agents create:agents read:modules create:modules update:modules delete:agents update:agents */

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  getAccessToken() {
    return this.accessToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.accessToken = authResult.accessToken;
    try {
        this.profile['permissions'] = this.parseJwt(authResult.accessToken).permissions;
    }
    catch(e){
        this.profile['permissions'] = [];
    }
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  }

  hasPermission(permission) {
    return (this.isAuthenticated() && this.profile['permissions'].includes(permission)) ? true : false;
  }

  parseJwt = (token) => {
      try {
          return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
          return null;
      }
   }

  permissions() {
    return this.profile.permissions;
  }

  signOut() {
    this.auth0.logout({
      returnTo: window.location.origin,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }

  apiAuthHeaders(){
    return {
        headers: { Authorization: `Bearer ${auth0Client.accessToken}` }
    };
  }
}

const auth0Client = new Auth();

export default auth0Client;
