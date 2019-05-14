
export const joinSession = sessionID => ({
  action: 'joinRoom',
  options: {
    sessionID
  }
})

export const createSession = () => ({
  action: 'createRoom'
})

export const createSinglePlayerSession = () => ({
  action: 'createSinglePlayerSession'
})

export const checkWord = word => ({
  action: 'checkWord',
  options: {
    word
  }
})

export const startGame = () => ({
  action: 'startGame'
})

export const selectedLetters = positions => ({
  action: 'selectedLetters',
  options: {
    positions
  }
})

export const finishGame = () => ({
  action: 'finishGame'
})

export const getScores = () => ({
  action: 'getScores'
})

export const setName = name => ({
  action: 'setName',
  options: {
    name
  }
})
