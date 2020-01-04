import chat from './chat/index.js'

;(async () => {
  const rtcPC = new RTCPeerConnection({
    'iceServers': [
      {
        'urls': 'stun:stun.l.google.com:19302'
      },
      {
        'urls': 'turn:192.158.29.39:3478?transport=udp',
        'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        'username': '28224511:1379330808'
      },
      {
        'urls': 'turn:192.158.29.39:3478?transport=tcp',
        'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        'username': '28224511:1379330808'
      }
    ]
  });
  
  const channel = rtcPC.createDataChannel('sendDataChannel');
  channel.onopen = () => {
    console.log('------ channel open');
    chat(channel)
  };

  // ------------------------------------
  const baseLink = `${location.origin}/webrtc-nsc/invitee.html`
  let linkParams = {
    offer: null,
    candidates: [],
  }
  
  function updateLink() {
    const link = baseLink + '?info=' + encodeURIComponent(JSON.stringify(linkParams))
    const el = document.getElementById('invite-link')
    el.innerHTML = link
    el.setAttribute('href', link)
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
      const answer = JSON.parse(document.getElementById('answer').value.trim());
      rtcPC.setRemoteDescription(new RTCSessionDescription(answer));
    })
})();