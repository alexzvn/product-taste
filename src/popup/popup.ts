import './popup.css'
import $ from 'jquery'
import { browser } from 'webextension-polyfill-ts'

$('#scan').on('click', async() => {
  browser.tabs.executeScript({
    code: `window.dispatchEvent(new Event('crawl:teechip'))`
  })
})
