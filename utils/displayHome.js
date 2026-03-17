export const home = document.querySelector('.home')
export async function displayHome() {
  home.style.display = 'flex'
  let userName = localStorage.getItem('userName')
  let auditRatio = localStorage.getItem('auditRatio')
  let firstName = localStorage.getItem('firstName')
  let lastName = localStorage.getItem('lastName')
  let address = localStorage.getItem('address')
  let email = localStorage.getItem('email')
  let token = localStorage.getItem('jwt')

  try {
    const response = await fetch(
      'https://zone01normandie.org/api/graphql-engine/v1/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `query getProgress($name: String!, $path: String!) {
  progress(where: {user: {login: {_eq: $name}}, _and: {path: {_eq: $path}}}) {
    path
    grade
    isDone
    campus
    group {
      captainLogin
      members {
        user {
          login
        }
      }
    }
  }
}  `,
          variables: {name: userName, path: '/madere/piscine-go/exam-01'}
        })
      }
    )
    const data = await response.json()
    if (data.errors) {
      console.error('Erreur GraphQL :', data.errors)
    } else {
      console.log(data.data)
    }
  } catch (error) {
    console.error('Erreur :', error)
  }

  home.innerHTML = `
  <div class="home-header">
      <div class="welcome">
         Bienvenue ${firstName} ${lastName}
      </div>
      <div class="userName">
         ${userName}
      </div>
      <button class="disconnect">Disconnect</button>
      </div>
  <div class="section">
      <div class="stats">
          <div class="stat">
           email :</div><div class="statResult"> ${email}
          </div>
      </div>
      <div class="stats">
          <div class="stat">
            address :</div><div class="statResult"> ${address}
          </div>
      </div>
      <div class="stats">
          <div class="stat">
            Audit Ratio :</div><div class="statResult"> ${auditRatio}
          </div>
      </div>
  </div>
  <div class="section2"></div>`
}
