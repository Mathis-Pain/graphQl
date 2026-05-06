export function disconnect() {
  console.log('Déconnexion en cours...');
  sessionStorage.clear();
  location.reload();
}
