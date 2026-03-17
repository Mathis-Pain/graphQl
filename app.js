import {connection} from './utils/connection.js'
import {disconnect} from './utils/disconnect.js'
import {home} from './utils/displayHome.js'

export const bodyForm = document.querySelector('.body-form')
export const form = document.querySelector('form')

home.style.display = 'none'
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  await connection()
  const disconnectButton = document.querySelector('.disconnect')
  disconnectButton.addEventListener('click', () => {
    disconnect()
  })
})
