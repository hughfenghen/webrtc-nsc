import './style.css'

function initChatDom() {
  const chatEL = document.createElement('div')
  chatEL.setAttribute('id', 'chat')
  chatEL.innerHTML = `
    <div class="history-msgs">
    </div>
    <textarea class="unsend-msg" placeholder="按回车发送消息"></textarea>
  `

  document.body.appendChild(chatEL)
}

function addMsg({ msg, isMe }) {
  const msgElWrap = document.createElement('div')
  msgElWrap.className = `msg-wrapper ${isMe ? 'me' : ''}`
  
  const msgEl = document.createElement('div')
  msgEl.className = `msg ${isMe ? 'me' : ''}`
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
      
      addMsg({ msg, isMe: true })
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

  channel.onmessage = ({ data }) => {
    console.log('------ channel onmessage:', data);
    addMsg({ msg: data, isMe: false })
  };

  channel.onclose = () => {
    console.log('------ chan closed');
    // todo: add system tips
  };
}