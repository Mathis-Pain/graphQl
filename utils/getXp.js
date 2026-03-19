export async function getXp() {
  let token = localStorage.getItem('jwt')
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
          query: `{ transaction(where: {type: {_eq: "xp"}}) { amount path createdAt } }`
        })
      }
    )

    const data = await response.json()
    if (data.errors) {
      console.error('Erreur GraphQL :', data.errors)
      return
    }

    // 1. Transformer les transactions en projets
    const projects = processTransactions(data.data.transaction)
    // 2. Générer et afficher le SVG
    document.getElementById('graph-container').innerHTML = generateSVG(projects)
  } catch (error) {
    console.error('Erreur :', error)
  }
}

// Fonction pour transformer les transactions en projets
function processTransactions(transactions) {
  const projectsMap = {}

  transactions.forEach((transaction) => {
    // Extraire le nom du projet depuis le path (ex: "/rouen/piscine-go/quest-01" → "quest-01")
    const pathParts = transaction.path.split('/')
    const projectName = pathParts[3] || transaction.path // Prend le 4ème segment ou le path entier

    if (!projectsMap[projectName]) {
      projectsMap[projectName] = {
        name: projectName,
        totalXP: 0,
        createdAt: transaction.createdAt
      }
    }
    projectsMap[projectName].totalXP += transaction.amount
  })

  // Convertir en tableau et trier par date
  return Object.values(projectsMap).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  )
}

// Fonction pour générer le SVG
function generateSVG(projects) {
  if (!projects || projects.length === 0) {
    return '<p>Aucun projet trouvé.</p>'
  }

  // Calcul des dimensions
  const maxXP = Math.max(...projects.map((p) => p.totalXP))
  const svgHeight = 300 // Augmenté pour les noms verticaux
  const barWidth = 15 // Élargi pour les noms
  const barGap = 10 // Espace supplémentaire pour les noms
  const svgWidth = projects.length * (barWidth + barGap) + 50

  // Génération des barres
  let bars = ''
  projects.forEach((project, index) => {
    const barHeight = (project.totalXP / maxXP) * (svgHeight - 80) // Ajusté pour les noms
    const x = index * (barWidth + barGap) + 30 // Décalage pour l'axe Y
    const y = svgHeight - barHeight - 50
    const isRecent =
      new Date(project.createdAt) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const fill = isRecent ? '#8A2BE2' : '#708090'

    // Nom du projet (vertical)
    const projectNameX = x + barWidth / 2
    const projectNameY = svgHeight - 30

    bars += `
      <g class="bar" data-project="${project.name}">
        <!-- Barre d'XP -->
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${fill}" rx="2"></rect>

        <!-- Valeur d'XP -->
        <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" fill="white" font-size="10">${Math.round(project.totalXP / 1000)}k</text>

        <!-- Nom du projet (vertical) -->
        <text
          x="${projectNameX}"
          y="${projectNameY}"
          transform="rotate(-90 ${projectNameX} ${projectNameY})"
          text-anchor="end"
          fill="#999"
          font-size="9"
        >${project.name}</text>
      </g>
    `
  })

  // Génération du SVG complet
  return `
    <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="overflow: visible;">
      <title>XP par Projet</title>
      <g font-family="Arial" font-size="10" fill="white">
        <!-- Axe Y (vertical) -->
        <line x1="30" y1="20" x2="30" y2="${svgHeight - 50}" stroke="#555"></line>
        <!-- Axe X (horizontal) -->
        <line x1="30" y1="${svgHeight - 50}" x2="${svgWidth - 20}" y2="${svgHeight - 50}" stroke="#555"></line>
        <!-- Barres -->
        ${bars}
        <!-- Labels -->
        <text x="15" y="15" fill="#999">XP (k)</text>
        <text x="${svgWidth / 2}" y="${svgHeight - 10}" text-anchor="middle" fill="#999">Projets</text>
      </g>
    </svg>
  `
}
