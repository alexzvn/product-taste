import { browser } from 'webextension-polyfill-ts'

const handler = document.createElement('script')

handler.setAttribute('src', browser.extension.getURL('handler.js'))

document.body.appendChild(handler)
