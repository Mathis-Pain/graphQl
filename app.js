import {connection} from './utils/connection.js';
import {disconnect} from './utils/disconnect.js';
import {displayHome, home} from './utils/displayHome.js';

export const bodyForm = document.querySelector('.body-form');
export const form = document.querySelector('form');
const token = localStorage.getItem('jwt');
if (!token) {
  home.style.display = 'none';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await connection();
    await displayHome();
  });
} else {
  bodyForm.style.display = 'none';
  await displayHome();
  const disconnectButton = document.querySelector('.disconnect');
  disconnectButton.addEventListener('click', () => {
    disconnect();
  });
}
