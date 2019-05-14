import settings from './settings'

import * as pureActions from '../actions'

class WebSocketManager {
  constructor (onMessage, onOpen, onClose) {
    this.websocket = new window.WebSocket(settings.url)

    this.websocket.onopen = onOpen
    this.websocket.onclose = onClose

    this.websocket.onmessage = evt => {
      onMessage(JSON.parse(evt.data))
    }

    this.actions = {}

    Object.entries(pureActions).forEach(entry => {
      this.actions[entry[0]] = (...params) =>
        this.websocket.send(
          JSON.stringify(entry[1](...params))
        )
    })
  }
}

export default WebSocketManager
