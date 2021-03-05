import $ from 'jquery'
import './notify'
import TeeChip from './crawler/teechip'

const success = (message: string) => {
  ($ as any).notify(message, {
    className: 'success',
    globalPosition: 'bottom right'
  })
}

window.addEventListener('crawl:teechip', () => {
  const data = new TeeChip().make();

  console.log(data);

  success(`Đã quét được ${data.length} loại sản phẩm`)
})