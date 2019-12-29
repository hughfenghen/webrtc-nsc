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

  rtcPC.setRemoteDescription(new RTCSessionDescription(info.offer));
  const answer = await rtcPC.createAnswer();
  rtcPC.setLocalDescription(answer);
  document.getElementById('answer').innerHTML = JSON.stringify(answer);
  console.log(11111, rtcPC.ondatachannel, info, answer);

  info.candidates.forEach(candidate => {
    rtcPC.addIceCandidate(new RTCIceCandidate(candidate))
  })

  rtcPC.ondatachannel = (chanEvt) => {
    console.log('------- ondatachannel');
    const { channel } = chanEvt;
    channel.onopen = () => {
      console.log('------- channel open');
    };
    channel.onmessage = ({ data }) => {
      console.log('===== onmessage: ', data);
    };
    channel.onclose = () => {
      console.log('------ chan closed');
      stopRecord();
    };
  }
})();