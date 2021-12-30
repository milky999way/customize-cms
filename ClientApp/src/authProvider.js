// in src/authProvider.js
import decodeJwt from 'jwt-decode';

export default {
  login: () => {
    //const request = new Request('/google-response', {
    //  method: 'GET',
    //  //body: JSON.stringify({ userId }),
    //  headers: new Headers({ 'Content-Type': 'application/json' }),
    //});
    //return fetch(request)
    //  .then(response => {
    //    if (response.status < 200 || response.status >= 300) {
    //      throw new Error(response.statusText);
    //    }
    //    return response.json();
    //  })
    //  .then(({ token }) => {
    //    console.log(token);
    //    //localStorage.setItem('token', token);
    //  });

    //localStorage.setItem('username', username);
    //// // accept all username/password combinations
    //return Promise.resolve();
  },



  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    // return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    if (localStorage.getItem('token') && localStorage.getItem('roles')) {
      const token = localStorage.getItem('token');
      const decodedToken = decodeJwt(token);
      const decodedRoles = decodedToken.roles;
      const storageRoles = localStorage.getItem('roles');
      // console.log("token  > roles : "+decodedRoles);
      // console.log("storage> roles : "+storageRoles);
      if (decodedRoles === storageRoles) {
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    } else {
      return Promise.reject();
    }
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => {
    const role = localStorage.getItem('roles');
    return role ? Promise.resolve(JSON.parse(role)) : Promise.reject();
  },
};