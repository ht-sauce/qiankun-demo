import config from "@/api/config.js"

const Phone = {
  opened: false,
  _socket: null,
  _ua: null,
  _session: null,
  _audio: null,
  _event: {
    _events: [],
    on(type, handler) {
      this._events[type] = this._events[type] || [];
      this._events[type].push(handler)
    },
    once(type, handler) {
      this._events[type] = [handler];
    },
    emit(type) {
      let args = [].slice.call(arguments, 1);
      (this._events[type] || []).forEach(fn => {
        fn && fn(...args)
      });
    }
  },
  _destroyCall() {
    this._session = null;
  },
  _initCall() {
    let session = this._session;
    if (!session) {
      return;
    }
    let connection = session ? session.connection : null;

    session.on('progress', (ev) => {
      console.log("progress");
      let calluuid = "";
      if (ev.response && ev.response.headers && ev.response.headers['X-View-Call-Uuid']) {
        calluuid = ev.response.headers['X-View-Call-Uuid'][0].raw || "";
      }
      this._event.emit("onMessage", { msgType: "EventRinging", data: { calluuid } });
    });
    session.on('failed', () => {
      console.log("failed");
      this._event.emit("onMessage", { msgType: "EventReleased" });
      this._destroyCall();
    });
    session.on('ended', () => {
      console.log("ended");
      this._event.emit("onMessage", { msgType: "EventReleased" });
      this._destroyCall();
    });
    session.on("accepted", () => {
      console.log("accepted");
    });
    session.on('confirmed', () => {
      console.log("confirmed");
      this._event.emit("onMessage", { msgType: "EventEstablished" });
    });
    session.on('sdp', (ev) => {
      let reg = /^a=candidate:\d+ \d udp \d+ \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
      let iceReg = /^a=candidate:/
      ev.sdp = ev.sdp.split("\n").filter(sdp => !iceReg.test(sdp) || reg.test(sdp)).join("\n")
      console.log("sdp");
    });

    let callid = session.id;
    if (!callid) {
      session.terminate({ status_code: 603, reason_phrase: 'Decline' });
      return null;
    }
    if (connection) {
      connection.onaddstream = () => {
        let remoteStreams = connection.getRemoteStreams();
        if (remoteStreams.length > 0) {
          this._audio.srcObject = remoteStreams[0];
        }
      };
      connection.onremovestream = () => {
        this._audio.src = '';
      };
    }
    session.bufferedInvite = null;
  },
  isOpen() {
    return this.opened;
  },
  open() {
    let fsConfig = config.getConfig("fsconfig");
    let account = "web";
    this._socket = new window.JsSIP.WebSocketInterface(fsConfig.socket);
    let configuration = {
      sockets: [this._socket],
      uri: `sip:${account}@web`,
      authorization_user: account,
      display_name: account,
      password: account,
      register: true,
      contact_uri: `sip:${account}@web;transport=wss`,
      register_expires: 30
    };
    this._ua = new window.JsSIP.UA(configuration);
    this._ua.on('connecting', () => {
      console.info('SIP connecting...')
    });
    this._ua.on('connected', () => {
      console.info('SIP connected')
      this._ua.unregister();
      setTimeout(() => { this._ua.register(); }, 500)
    });
    this._ua.on('disconnected', () => {
      console.warn('SIP disconnected')
    });
    this._ua.on('registered', () => {
      console.info('SIP registered')
      this.opened = true;
      this._event.emit("onMessage", { msgType: "EventOpened", status: true })
    });
    this._ua.on('unregistered', () => {
      this.opened = false;
      console.info('SIP unregistered')
    });
    this._ua.on('registrationFailed', () => {
      this.opened = false;
      console.error('SIP registrationFailed')
    });
    this._ua.on('newRTCSession', (ev) => {
      console.info('SIP newRTCSession...');
      if (ev.originator == 'local') {
        this._event.emit("onMessage", { msgType: "EventDialing" })
        setTimeout(function() {
          var evt = document.createEvent('Event');
          evt.initEvent('icecandidate', false, false);
          ev.session.connection.dispatchEvent(evt);
        }, 1500);
        return;
      }
    });
    this._ua.on('newMessage', () => {
      console.error('SIP newMessage');
    });
    this._ua.start();

    this._audio = document.createElement("AUDIO");
    this._audio.setAttribute("autoplay", "autoplay");
  },
  callout(phoneNum, { extraHeaders }) {
    let fsConfig = config.getConfig("fsconfig");
    var options = {
      mediaConstraints: { audio: true, video: false },
      pcConfig: {
        iceServers: [
          { urls: fsConfig.ice }
        ]
      },
      sessionTimersExpires: 1800,
      no_answer_timeout: 180,
      register_expires: 1800,
      mediaStream: null,
      extraHeaders: extraHeaders
    };
    this._session = this._ua.call(phoneNum, options);
    this._initCall();
  },
  hangup() {
    if (this._session) {
      this._session.terminate({ status_code: 603, reason_phrase: 'Decline' });
    }
    this._destroyCall();
  },
  onMessage(fn) {
    this._event.once("onMessage", fn);
  }
}

export default Phone;