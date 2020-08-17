import chat from './chat/index.js'

;(async () => {
  const rtcPC = new RTCPeerConnection({
    iceServers: [
      // { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:ks-sh-live-p2p-01.chat.bilibili.com:3478' },
    ]
  });
  
  const channel = rtcPC.createDataChannel('sendDataChannel');
  channel.onopen = () => {
    console.log('------ channel open');
    document.querySelector('.page1').style.display = 'none'
    chat(channel)
  };

  // ------------------------------------
  const baseLink = `${location.origin}/webrtc-nsc/invitee.html`
  let fullLink = ''
  let linkParams = {
    offer: null,
    candidates: [],
  }
  
  function updateLink() {
    fullLink = baseLink + '?info=' + encodeURIComponent(JSON.stringify(linkParams))
    const el = document.getElementById('invite-link')
    el.innerHTML = fullLink
    el.setAttribute('href', fullLink)
  }

  rtcPC.onicecandidate = ({ candidate }) => {
    console.log('------ send candiate: ', candidate);
    if (candidate !== null) {
      linkParams.candidates.push(candidate)
      updateLink()
    }
  };

  const offer = await rtcPC.createOffer();
  rtcPC.setLocalDescription(offer);
  linkParams.offer = offer
  updateLink()

  document.getElementById('connect')
    .addEventListener('click', () => {
      const { answer, candidates } = JSON.parse(document.getElementById('answer').value.trim());
      rtcPC.setRemoteDescription(new RTCSessionDescription(answer));
      candidates.forEach(candidate => {
        rtcPC.addIceCandidate(new RTCIceCandidate(candidate))
      })
    })
  document.querySelector('.copy-icon')
    .addEventListener('click', ({ target }) => {
      navigator.clipboard
        .writeText(fullLink)
        .then(() => {
          target.classList.add('copied')
          setTimeout(function() {
            target.classList.remove('copied')
          }, 2000);
        })
    })
})();