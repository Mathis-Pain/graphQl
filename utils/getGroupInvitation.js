export async function getGroupInvitation() {
  const userName = sessionStorage.getItem('userName');
  const token = sessionStorage.getItem('jwt');

  if (!token) {
    console.error('Token JWT manquant');
    return null;
  }

  try {
    const response = await fetch(
      'https://zone01normandie.org/api/graphql-engine/v1/graphql',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query getInvitations($login: String!) {
              group_user(where: { userLogin: { _eq: $login }, accepted: { _is_null: true } }) {
                id
                enrollment
                accepted
                createdAt
                answeredAt
                enrollerId
                group { id path }
              }
            }
          `,
          variables: {login: userName}
        })
      }
    );

    const groupInvitation = await response.json();

    if (groupInvitation.errors) {
      console.error('Erreur GraphQL :', groupInvitation.errors);
      return null;
    }

    const invitations = groupInvitation.data.group_user;

    const enrollerLogins = await Promise.all(
      invitations.map((inv) => getUserEnrollment(token, inv.enrollerId))
    );

    const container = document.getElementById('section3');
    if (container) {
      container.innerHTML = enrollerLogins
        .map(
          (user) =>
            `<div class="statResult">${user?.data?.user_public_view?.[0]?.login ?? 'Inconnu'}</div>`
        )
        .join('');
    }
  } catch (error) {
    console.error('Erreur :', error);
    return null;
  }
}

async function getUserEnrollment(token, idUserEnrollment) {
  try {
    const response = await fetch(
      'https://zone01normandie.org/api/graphql-engine/v1/graphql',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query getUser($id: Int!) {
              user_public_view(where: { id: { _eq: $id } }) {
                login
              }
            }
          `,
          variables: {id: idUserEnrollment}
        })
      }
    );

    const data = await response.json();

    if (data.errors) {
      console.error('Erreur GraphQL :', data.errors);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur :', error);
    return null;
  }
}
