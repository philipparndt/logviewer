import { ForegroundColor } from "chalk"
import { Box, Text } from "ink"
import React from "react"
import ScrollView from "./ScrollView.js"

type JSONLogLineProps = {
    data: any
    lineWidth: number
    x: number
}

const colorForLevel = (level: string): typeof ForegroundColor => {
    switch (level) {
    case "ERROR":
        return "red"
    case "WARN":
        return "yellow"
    case "INFO":
        return "green"
    case "DEBUG":
        return "magenta"
    default:
        return "black"
    }
}

const JSONLogLine = ({ data, x, lineWidth }: JSONLogLineProps) => {
    const timestamp = `${data.ts} `
    const level = data.level
    const message = ` ${data.message}`
    return <>
        <Box>
            <ScrollView x={x} with={lineWidth}>
                <Text color="gray">{timestamp}</Text>
                <Text backgroundColor={colorForLevel(level)}>{level}</Text>
                <Text>{message}</Text>
            </ScrollView>
        </Box>
    </>
}

export default JSONLogLine
