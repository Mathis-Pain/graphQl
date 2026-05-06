import {getToken} from './getToken.js';
import {bodyForm} from '../app.js';
import {displayHome} from './displayHome.js';
import {form} from '../app.js';

export async function connection() {
  const pseudo = document.querySelector('[name="name"]').value;
  const password = document.querySelector('[name="password"]').value;

  try {
    const token = await getToken(pseudo, password);
    form.reset();
    if (!token) throw new Error('Token non reçu');
    sessionStorage.setItem('jwt', token);
    console.log('Token stocké :', token);

    const response = await fetch(
      'https://zone01normandie.org/api/graphql-engine/v1/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `query getUserInfo($name: String!) {
  user(where: {login: {_eq: $name}}) {
    profile
    login
    attrs
    auditRatio
    campus
    createdAt
    totalDown
    totalUp
    updatedAt
  }
}   `,
          variables: {name: pseudo}
        })
      }
    );

    const data = await response.json();
    if (data.errors) {
      console.error('Erreur GraphQL :', data.errors);
    } else {
      sessionStorage.setItem('userName', data.data.user[0].login);
      sessionStorage.setItem('firstName', data.data.user[0].attrs.firstName);
      sessionStorage.setItem('lastName', data.data.user[0].attrs.lastName);
      sessionStorage.setItem('auditRatio', data.data.user[0].auditRatio);
      sessionStorage.setItem('email', data.data.user[0].attrs.email);
      sessionStorage.setItem('address', data.data.user[0].attrs.addressCity);
      console.log('totalUp', data.data.user[0].totalUp);
      displayHome();
      bodyForm.style.display = 'none';
    }
  } catch (error) {
    console.error('Erreur :', error);
  }
}
