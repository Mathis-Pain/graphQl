import {getXpByProject} from './getXpByProject.js'
import {getXp} from './getXp.js'

export const home = document.querySelector('.home')
export const chart = document.querySelector('#chart')
export async function displayHome() {
  home.style.display = 'flex'
  let userName = localStorage.getItem('userName')
  let auditRatio = localStorage.getItem('auditRatio')
  let firstName = localStorage.getItem('firstName')
  let lastName = localStorage.getItem('lastName')
  let address = localStorage.getItem('address')
  let email = localStorage.getItem('email')

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
  <div class="stat1">TotalUp</div>
  <div class="stat2">TotalDown</div>
  <div class="stat3">TotalUpBonus</div>
  
  
  
  
  </div></div>`

  await getXpByProject()
  await getXp()
}
