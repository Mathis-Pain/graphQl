import {getToken} from './getToken.js'
import {bodyForm} from '../app.js'
import {displayHome} from './displayHome.js'
import {form} from '../app.js'

export async function connection() {
  const pseudo = document.querySelector('[name="name"]').value
  const password = document.querySelector('[name="password"]').value

  try {
    const token = await getToken(pseudo, password)
    form.reset()
    if (!token) throw new Error('Token non reçu')
    localStorage.setItem('jwt', token)
    console.log('Token stocké :', token)

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
    )

    const data = await response.json()
    if (data.errors) {
      console.error('Erreur GraphQL :', data.errors)
    } else {
      localStorage.setItem('userName', data.data.user[0].login)
      localStorage.setItem('firstName', data.data.user[0].attrs.firstName)
      localStorage.setItem('lastName', data.data.user[0].attrs.lastName)
      localStorage.setItem('auditRatio', data.data.user[0].auditRatio)
      localStorage.setItem('email', data.data.user[0].attrs.email)
      localStorage.setItem('address', data.data.user[0].attrs.addressCity)
      displayHome()
      bodyForm.style.display = 'none'
      console.log('Données reçues :', data.data.user[0])
    }
  } catch (error) {
    console.error('Erreur :', error)
  }
}
