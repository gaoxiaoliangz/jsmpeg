document.getElementById('rtsp').value = document.querySelector('.examples p:first-child').innerHTML

const api = axios.create({
  baseURL: 'http://localhost:8233/api',
})

const requestWS = rtsp => {
  return api.put('streaming', {
    rtsp,
  })
}

const play = async () => {
  const rtsp = document.getElementById('rtsp').value
  const { data, error } = await requestWS(rtsp).catch(error => {
    return { error }
  })

  if (error) {
    return alert(error.message)
  }

  const { ws } = data
  const hostname = location.hostname
  const wsURL = `ws://${hostname}:${ws.port}${ws.path}`

  
  const createPlayerAndPlay = () => {
    const canvas = document.createElement('canvas')
    const wrap = document.querySelector('.players')
    wrap.appendChild(canvas)

    const player = new JSMpeg.Player(wsURL, {
      canvas,
      wsOnFrameLossCallback: () => {
        console.log('oops...')
        player.destroy()
        createPlayerAndPlay()
      }
      // 似乎没什么作用
      // videoBufferSize: 1024 * 1024 * 3,
    })
  
    player.play()
    console.log(`play ${wsURL}`)
  }

  createPlayerAndPlay()
}

const getStatus = () => {
  api.get('streaming/status').then(res => {
    const statusDiv = document.querySelector('.status')
    const pre = document.createElement('pre')
    const content = JSON.stringify(res.data, null, 2)
    pre.innerHTML = content
    statusDiv.innerHTML = ''
    statusDiv.append(pre)
  })
}

const clearStatus = () => {
  const statusDiv = document.querySelector('.status')
  statusDiv.innerHTML = ''
}

const killAll = () => {
  api.post('streaming/kill-all').then(res => {
    console.log(`killed ${res.data.total} task(s)`)
  })
}

window.killAll = killAll
document.querySelector('.js-play').addEventListener('click', play)
document.querySelector('.js-get-status').addEventListener('click', getStatus)

Array.from(document.querySelector('.examples').childNodes).forEach(node => {
  if (node.nodeType === 1) {
    node.addEventListener('click', () => {
      document.getElementById('rtsp').value = node.textContent
    })
  }
})
