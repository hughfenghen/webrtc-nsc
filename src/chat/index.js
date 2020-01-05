import './style.css'

function initChatDom() {
  const chatEL = document.createElement('div')
  chatEL.setAttribute('id', 'chat')
  chatEL.innerHTML = `
    <div class="history-msgs"></div>
    <textarea class="unsend-msg" placeholder="按回车发送消息"></textarea>
  `

  document.body.appendChild(chatEL)
}

function addMsg({ msg, type }) {
  const msgElWrap = document.createElement('div')
  msgElWrap.className = `msg-wrapper ${type}`

  const msgEl = document.createElement('div')
  msgEl.className = `msg ${type}`
  msgEl.innerHTML = msg
  msgElWrap.appendChild(msgEl)

  document.querySelector('#chat .history-msgs')
    .appendChild(msgElWrap)
}

function sendEvent(channel) {
  document.querySelector('#chat .unsend-msg')
    .addEventListener('keydown', (evt) => {
      const { key, target } = evt
      if (key !== 'Enter') return
      if (evt.shiftKey || evt.ctrlKey) return
      evt.preventDefault()
      const msg = target.value.trim()
      if (!msg) return

      addMsg({ msg, type: 'me' })
      target.value = ''
      channel.send(msg)
      // todo: 消息发送失败
    })
}

// initChatDom()
// sendEvent()

export default function chat(channel) {
  initChatDom()
  sendEvent(channel)

  addMsg({ 
    msg: '私密连接已建立，你可以发送消息，也可以<a href="https://github.com/hughfenghen/webtrc-nsc" target="_blank">了解详情</a>', 
    type: 'system' 
  })
  channel.onmessage = ({ data }) => {
    console.log('------ channel onmessage:', data);
    addMsg({ msg: data, type: 'friend' })
  };

  channel.onclose = () => {
    console.log('------ chan closed');
    addMsg({
      msg: '连接已断开',
      type: 'system'
    })
  };

  window.addEventListener('beforeunload', () => {
    channel.close()
  })
}