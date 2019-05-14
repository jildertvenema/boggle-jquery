import $ from 'jquery'

import Boggle from '../boggle'

import { getSecondsLeft, pointsTouch, getS } from './helpers'


let selectedLetters = []
let tail = {}
let points = 0

const onMessage = message => {
    console.log(message)
    if (message.gameStarted) {
        updateBoard(message)
        $('#boggle-check-button').show().click(checkWord)
        setTimer(message.board.endTime)
    }
    if (message.points) {
        points = message.points
        $('#boggle-points').html(`${points} point${getS(points)}`)
    }
}


const setTimer = time => {
    const timeElement = $('#boggle-timer')
    timeElement.show()

    setInterval(function() {
        const secondsLeft = Math.max(getSecondsLeft(time), 0)
        timeElement.html(`${secondsLeft} second${getS(secondsLeft)} left`)
        if (secondsLeft <= 0) {
            const BoggleGrid = $('#boggle-grid-container')
            BoggleGrid.html('')
            clearInterval(this)
        }
    }, 200)
}

const checkWord = () => {
    actions.checkWord(selectedLetters.join(''))

    resetSelectedLetters()
}

const resetSelectedLetters = () => {
    const BoggleGrid = $('#boggle-grid-container')
    BoggleGrid.children().each(function() {
        $(this).addClass('btn-info').removeClass('btn-primary').removeClass('btn-light')
    })
    selectedLetters = []
    $('#boggle-word').html('')
}

const updateBoard = message => {
    const BogggleLetter = $('<button type="button" class="btn btn-info grid-item"></button>').append(`<p class="boggle-letter">${'A'}</p>`)
    const BoggleGrid = $('#boggle-grid-container')
    for (let x = 0 ; x < gridSize ; x ++) {
        for (let y = 0; y < gridSize ; y ++) {
            const letter = message.board.board[x][y]
            BoggleGrid.append(BogggleLetter.clone().click(function() {
                onLetterClick(this, x, y, letter)
            }).html(`<p>${letter}</p>`)
        )}
    }
}

const onConnect = () => {
    const StartButton = $('#boggle-start-button')
    console.log('connected')
    actions.createSinglePlayerSession()

    StartButton.show()

    StartButton.click(() => {
        actions.startGame()
        StartButton.hide()
    })
}

const onDisconnect = () => {
    console.log('disconnected')
}


const onLetterClick = (element, x, y, letter) => {
    console.log(x, y, letter)
    const BoggleGrid = $('#boggle-grid-container')
    const letterElement =  $( element )
    if (letterElement.hasClass('btn-primary')) {
        resetSelectedLetters()
    } else if (!letterElement.hasClass('btn-light')) {
        $( element ).removeClass('btn-info').addClass('btn-primary')
        selectedLetters.push(letter)

        tail.x = x
        tail.y = y
        
        BoggleGrid.children().each(function(index) {
            const x = index % gridSize
            const point = {
                y: x,
                x: (index - x) / gridSize
            }
            console.log(point)
            if (!pointsTouch(tail, point) && !$(this).hasClass('btn-primary')) {
                $(this).addClass('btn-light').removeClass('btn-primary').removeClass('btn-info')
            } else if (!$(this).hasClass('btn-primary')){
                $(this).removeClass('btn-light').removeClass('btn-primary').addClass('btn-info')
            }
        })

        $('#boggle-word').html(selectedLetters.join(''))
    }
}



const BoggleInstance = new Boggle(onMessage, onConnect, onDisconnect)
const { actions } = BoggleInstance

const gridSize = 5
