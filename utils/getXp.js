export async function getXp() {
  const userName = localStorage.getItem('userName')
  const token = localStorage.getItem('jwt')

  if (!token) {
    console.error('Token JWT manquant')
    return null
  }

  try {
    const response = await fetch(
      'https://zone01normandie.org/api/graphql-engine/v1/graphql',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            query getUserStats($login: String!) {
              user(where: { login: { _eq: $login } }) {
                totalUp
                totalUpBonus
                totalDown
              }
            }
          `,
          variables: {login: userName}
        })
      }
    )

    const data = await response.json()

    if (data.errors) {
      console.error('Erreur GraphQL :', data.errors)
      return null
    }

    const stats = data.data.user[0]
    if (!stats) {
      console.warn('Aucun utilisateur trouvé')
      return null
    }

    // 🔥 Création du camembert avec les vraies données
    const svg = createPieChart(
      stats.totalUp,
      stats.totalUpBonus,
      stats.totalDown
    )

    // 👉 injecte dans ton div #chart
    const container = document.getElementById('chart')
    container.innerHTML = '' // reset
    container.appendChild(svg)

    return stats
  } catch (error) {
    console.error('Erreur :', error)
    return null
  }
}

function createPieChart(totalUp, totalUpBonus, totalDown) {
  const total = totalUp + totalUpBonus + totalDown

  const data = [
    {value: totalUp, color: 'turquoise'},
    {value: totalUpBonus, color: 'white'},
    {value: totalDown, color: '#999'}
  ]

  const radius = 80
  const circumference = 2 * Math.PI * radius

  let offset = 0

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', 200)
  svg.setAttribute('height', 200)
  svg.setAttribute('viewBox', '0 0 200 200')

  data.forEach((item) => {
    const percent = item.value / total
    const dash = percent * circumference

    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    )
    circle.setAttribute('cx', 100)
    circle.setAttribute('cy', 100)
    circle.setAttribute('r', radius)
    circle.setAttribute('fill', 'none')
    circle.setAttribute('stroke', item.color)
    circle.setAttribute('stroke-width', 40)
    circle.setAttribute('stroke-dasharray', `${dash} ${circumference}`)
    circle.setAttribute('stroke-dashoffset', -offset)
    circle.setAttribute('transform', 'rotate(-90 100 100)')

    svg.appendChild(circle)

    offset += dash
  })

  return svg
}
