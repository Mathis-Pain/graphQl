export function disconnect() {
  console.log('Déconnexion en cours...')
  localStorage.removeItem('jwt')
  localStorage.removeItem('userName')
  location.reload()
}
