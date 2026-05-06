export function disconnect() {
  console.log('Déconnexion en cours...');
  sessionStorage.removeItem('jwt');
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('firstName');
  sessionStorage.removeItem('lastName');
  sessionStorage.removeItem('auditRatio');
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('address');
  sessionStorage.removeItem('totalUp');
  location.reload();
}
