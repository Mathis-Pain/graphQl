export async function getToken(pseudo, password) {
  try {
    const response = await fetch(
      'https://zone01normandie.org/api/auth/signin',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${pseudo}:${password}`)}`
        }
      }
    )
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    let result = await response.json() // Change text() en json()
    console.log('Réponse API :', result) // Debug
    return result // ou result.jwt selon la réponse
  } catch (error) {
    console.error(error.message)
  }
}
