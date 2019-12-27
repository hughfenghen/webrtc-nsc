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
rtcPC.onicecandidate = ({ candidate }) => {
  console.log('------ send candiate to ', candidate);
  if (candidate !== null) {
    // sendCandidate(candidate);
  }
};
const channel = rtcPC.createDataChannel('sendDataChannel');
channel.onopen = () => {
  console.log('------ channel open');
  channel.send('dididi');
};
channel.onmessage = evt => {
  console.log('------ channel onmessage', evt); 
};

const offer = await rtcPC.createOffer();
rtcPC.setLocalDescription(offer);


document.getElementById('create-link')
  .addEventListener('click', () => {
    
  })