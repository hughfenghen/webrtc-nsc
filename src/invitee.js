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

  const url = new URL(location.href)
  const info = JSON.parse(url.searchParams.get('info'))
  console.log('-------- info:', info);

  rtcPC.setRemoteDescription(new RTCSessionDescription(info.offer));
  const answer = await rtcPC.createAnswer();
  rtcPC.setLocalDescription(answer);

  info.candidates.forEach(candidate => {
    rtcPC.addIceCandidate(new RTCIceCandidate(candidate))
  })

  const candidates = []
  let connectInfo = {}

  function updateAnswer() {
    connectInfo = JSON.stringify({
      answer,
      candidates,
    });
  }

  rtcPC.onicecandidate = ({ candidate }) => {
    console.log('------ send candiate: ', candidate);
    if (candidate !== null) {
      candidates.push(candidate);
      updateAnswer()
    }
  };

  rtcPC.ondatachannel = (chanEvt) => {
    console.log('------- ondatachannel');
    const { channel } = chanEvt;
    channel.onopen = () => {
      console.log('------- channel open');
      document.querySelector('.page2').style.display = 'none'
      chat(channel)
    };
    channel.onmessage = ({ data }) => {
      console.log('===== onmessage: ', data);
    };
  }

  document.querySelector('.copy-icon')
    .addEventListener('click', ({ target }) => {
      navigator.clipboard
        .writeText(connectInfo)
        .then(() => {
          target.classList.add('copied')
          setTimeout(function () {
            target.classList.remove('copied')
          }, 2000);
        })
    })
})();