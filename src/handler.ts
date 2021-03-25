import $ from 'jquery'
import './notify'
import TeeChip from './crawler/teechip'

const success = (message: string) => {
  ($ as any).notify(message, {
    className: 'success',
    globalPosition: 'bottom right'
  })
}

window.addEventListener('crawl:teechip', async() => {
  const data = await new TeeChip().make();

  console.log(JSON.stringify(data, null, 2));

  success(`Đã quét được ${data.length} loại sản phẩm`)
})
