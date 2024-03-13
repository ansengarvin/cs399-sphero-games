﻿import React, { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import man2 from '../../man2.png'

function Canvas(props) {
    return (
        <canvas ref />
    )
}

const CanvasContainer = styled.div`
    canvas{
        //border: 1px solid red;
    }
`


function drawTile(context, entrances, color, x, y) {
    // Entrances should have the form [N, S, E, W]
    context.fillStyle = '#000000'
    context.fillRect(x, y, 100, 100)
    context.fillStyle = color
    context.fillRect(x + 10, y + 10, 80, 80)

    if (entrances["North"]) {
        context.fillRect(x + 10, y, 80, 10)
    }

    if (entrances["South"]) {
        context.fillRect(x + 10, y + 90, 80, 10)
    }

    if (entrances["East"]) {
        context.fillRect(x + 90, y + 10, 10, 80)
    }

    if (entrances["West"]) {
        context.fillRect(x, y + 10, 10, 80)
    }
}

function drawEdge(context, orientation, x, y, color = null) {
    context.fillStyle = '#000000'
    switch (orientation) {
        case 0:
            context.fillRect(x, y, 100, 50)
            if (color) {
                context.fillStyle = color
                context.fillRect(x + 35, y, 25, 50)
            }
            break
        case 1:
            context.fillRect(x, y, 50, 100)
            if (color) {
                context.fillStyle = color
                context.fillRect(x, y + 40, 50, 25)
            }
            break
    }
}

function drawCorner(context, x, y) {
    context.fillStyle = '#000000'
    context.fillRect(x, y, 50, 50)
}

function drawPlayerPod(context, orientation, color, x, y) {
    context.fillStyle = '#000000'
    switch (orientation) {
        case 0:
            context.fillRect(x, y, 100, 50)
            context.fillStyle = color
            context.fillRect(x + 10, y + 10, 80, 40)
            context.fillStyle = '#000000'
            context.fillRect(x + 10, y + 40, 10, 10)
            context.fillRect(x + 80, y + 40, 10, 10)
            break
        case 1:
            context.fillRect(x, y, 50, 100)
            context.fillStyle = color
            context.fillRect(x, y + 10, 40, 80)
            context.fillStyle = '#000000'
            context.fillRect(x, y + 10, 10, 10)
            context.fillRect(x, y + 80, 10, 10)
            break
        case 2:
            context.fillRect(x, y, 100, 50)
            context.fillStyle = color
            context.fillRect(x + 10, y, 80, 40)
            context.fillStyle = '#000000'
            context.fillRect(x + 10, y, 10, 10)
            context.fillRect(x + 80, y, 10, 10)
            break
        case 3:
            context.fillRect(x, y, 50, 100)
            context.fillStyle = color
            context.fillRect(x + 10, y + 10, 40, 80)
            context.fillStyle = '#000000'
            context.fillRect(x + 40, y + 10, 10, 10)
            context.fillRect(x + 40, y + 80, 10, 10)
            break
    }
}

function drawText(context, text, x, y) {
    context.fillStyle = '#000000'

    context.fillText(text, x, y, [200])
}

// Centralized location to keep track of colors rather than having to go in and type all of them myself.
const TileColors = {
    0: '#bb3333',
    1: '#ea740c',
    2: '#f5b342',
    3: '#f7de3b',
    4: '#69b43e',
    5: '#006e1a',
    6: '#33fe7a',
    7: '#34ffd3',
    8: '#3265ff',
    9: '#7033ff',
    10: '#d293ff',
    11: '#ff80b7',
}

export function Board(props) {
    const { data, state } = props
    const canvasRef = useRef(null)


    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        context.canvas.height = 550
        context.canvas.width = 550

        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, context.canvas.height, context.canvas.width)
        context.fillStyle = '#ff0000'


        /* All of the allowable pieces
        drawPlayerPod(context, 0, '#fcff51', 0, 0)
        drawPlayerPod(context, 1, '#fcff51', 200, 0)
        drawPlayerPod(context, 2, '#fcff51', 400, 0)
        drawPlayerPod(context, 3, '#fcff51', 0, 200)
        drawTile(context, 0, '#fcff51', 200, 200)
        drawTile(context, 0, '#000000', 200, 200)
        drawEdge(context, 0, 400, 200)
        drawEdge(context, 1, 0, 400)
        drawCorner(context, 200, 400)
        */

        // Top Row
        drawEdge(context, 0, 0, 0)                                                        // Edge
        drawEdge(context, 0, 100, 0)                                                      // Edge
        drawEdge(context, 0, 200, 0)                                                      // Edge
        drawPlayerPod(context, 0, TileColors[6], 300, 0)                                    // Tile 6 Player
        drawTile(context, {}, '#000000', 400, 0)                                        // Edge
        drawEdge(context, 1, 500, 0)                                                      // Edge

        // Second Row
        drawTile(context, {}, '#000000', 0, 50)                                         // Edge
        drawPlayerPod(context, 3, TileColors[7], 100, 50)                                   // Tile 7 Player
        drawTile(context, { "West": 1, "South": 1, "East": 1 }, TileColors[7], 150, 50)     // Tile 7 Sphero
        drawEdge(context, 1, 250, 50, TileColors[6])                                        // In-Between Tile East of 6
        drawTile(context, { "East": 1, "South": 1, "West": 1 }, TileColors[6], 300, 50)     // Tile 6 Sphero
        drawPlayerPod(context, 0, TileColors[4], 400, 100)                                  // Tile 4 Player
        drawEdge(context, 1, 500, 100)                                                    // Edge

        // Third Row
        drawPlayerPod(context, 3, TileColors[9], 0, 150)                                    // Tile 9 Player
        drawTile(context, { "East": 1, "West": 1, "South": 1 }, TileColors[9], 50, 150)     // Tile 9 Sphero
        drawTile(context, { "West": 1, "North": 1, "South": 1 }, TileColors[8], 150, 150)   // Tile 8 Sphero
        drawPlayerPod(context, 3, TileColors[5], 250, 150)                                  // Tile 5 Player
        drawTile(context, { "West": 1, "North": 1, "East": 1 }, TileColors[5], 300, 150)    // Tile 5 Sphero
        drawTile(context, { "West": 1, "North": 1, "South": 1 }, TileColors[4], 400, 150)   // Tile 4 Sphero
        drawEdge(context, 1, 500, 200)                                                    // Edge

        // Fourth Row
        drawEdge(context, 1, 0, 250)                                                      // Edge
        drawEdge(context, 0, 50, 250, TileColors[9])                                        // In-Between Tile South of 9
        drawPlayerPod(context, 2, TileColors[8], 150, 250)                                  // Tile 8 Player
        drawCorner(context, 250, 250)                                                     // Board Center
        drawPlayerPod(context, 0, TileColors[2], 300, 250)                                  // Tile 2 Player
        drawEdge(context, 0, 400, 250, TileColors[3])                                       // In-Between Tile North of 4


        // Fifth Row
        drawTile(context, { "South": 1, "East": 1, "North": 1 }, TileColors[10], 50, 300)    // Tile 10 Sphero
        drawTile(context, { "West": 1, "East": 1, "South": 1 }, TileColors[11], 150, 300)    // Tile 11 Sphero
        drawPlayerPod(context, 1, TileColors[11], 250, 300)                                  // Tile 11 Player
        drawTile(context, { "South": 1, "North": 1, "East": 1 }, TileColors[2], 300, 300)   // Tile 2 Sphero
        drawTile(context, { "West": 1, "East": 1, "North": 1 }, TileColors[3], 400, 300)    // Tile 3 Sphero
        drawPlayerPod(context, 1, TileColors[3], 500, 300)                                  // Tile 3 Player

        // Sixth Row
        drawEdge(context, 1, 0, 350)
        drawPlayerPod(context, 2, TileColors[10], 50, 400)                                   // Tile 10 Player
        drawTile(context, { "North": 1, "South": 1, "East": 1 }, TileColors[0], 150, 400)   // Tile 0 Sphero
        drawEdge(context, 1, 250, 400, TileColors[0])                                       // Tile 0 Player
        drawTile(context, { "West": 1, "North": 1, "East": 1 }, TileColors[1], 300, 400)    // Tile 1 Sphero
        drawPlayerPod(context, 1, TileColors[1], 400, 400)                                  // Tile 1 Player
        drawTile(context, {}, '#000000', 450, 400)

        // Seventh Row
        drawEdge(context, 1, 0, 450)                                                      // Edge
        drawTile(context, {}, '#000000', 50, 450)                                       // Edge
        drawPlayerPod(context, 2, TileColors[0], 150, 500)                                  // Tile 0 Player
        drawEdge(context, 0, 250, 500)                                                    // Edge
        drawEdge(context, 0, 350, 500)                                                    // Edge
        drawEdge(context, 0, 450, 500)                                                    // Edge

        context.font = "15px Georgia"
        drawText(context, data.board["0"]["name"], 200, 450) // Tile 0
        drawText(context, data.board["1"]["name"], 350, 450) // Tile 1
        drawText(context, data.board["2"]["name"], 350, 350) // Tile 2
        drawText(context, data.board["3"]["name"], 450, 350) // Tile 3
        drawText(context, data.board["4"]["name"], 450, 200) // Tile 4
        drawText(context, data.board["5"]["name"], 350, 200) // Tile 5
        drawText(context, data.board["6"]["name"], 350, 100) // Tile 6
        drawText(context, data.board["7"]["name"], 200, 100) // Tile 7
        drawText(context, data.board["8"]["name"], 200, 200) // Tile 8
        drawText(context, data.board["9"]["name"], 100, 200) // Tile 9
        drawText(context, data.board["10"]["name"], 100, 350) // Tile 10
        drawText(context, data.board["11"]["name"], 200, 350) // Tile 10

        /*
        const hIcon = new Image()
        hIcon.src = man2
        console.log("Before load")
        hIcon.onload = () => {
            console.log("onLoad")
            context.drawImage(hIcon, 0, 0, 50, 50)
        }
        */

    }, [])

    return (
        <div>
            <img src={man2} />
            Canvas Test
            <CanvasContainer>
                <canvas ref={canvasRef} />
            </CanvasContainer>
        </div>
    )
}