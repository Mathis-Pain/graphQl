import {getXpByProject} from './getXpByProject.js';
import {getXp} from './getXp.js';
import {getGroupInvitation} from './getGroupInvitation.js';

export const home = document.querySelector('.home');
export const chart = document.querySelector('#chart');
export async function displayHome() {
  home.style.display = 'flex';
  let userName = sessionStorage.getItem('userName');
  let auditRatio = sessionStorage.getItem('auditRatio');
  let firstName = sessionStorage.getItem('firstName');
  let lastName = sessionStorage.getItem('lastName');
  let address = sessionStorage.getItem('address');
  let email = sessionStorage.getItem('email');

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
  <div class="section2"><div id="graph-container"></div>
  <div id="chart"></div><div class="legend"> 
  </div>

  </div><div class="listEnrollement"><div class="stat-invit">Tu as des invitations de la part de :</div><div id="section3">...</div></div>`;

  await getXpByProject();
  await getXp();
  await getGroupInvitation();
}
