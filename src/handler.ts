import $ from 'jquery'
import './notify'
import TeeChip from './crawler/teechip'
import axios from 'axios'

const success = (message: string) => {
  ($ as any).notify(message, {
    className: 'success',
    globalPosition: 'bottom right'
  })
}

window.addEventListener('crawl:teechip', async() => {
  const data = await new TeeChip().make();

  axios.post('https://emcong.com/api/crawl/teechip', data)

  console.log(JSON.stringify(data, null, 2));

  success(`Đã quét được ${data.length} loại sản phẩm`)
})
