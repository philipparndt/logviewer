import { ForegroundColor } from "chalk"
import { Box, Text } from "ink"
import React from "react"
import { text } from "stream/consumers"
import LogLine from "./LogLine"
import Space from "./Space"

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

const LogLevel = (props: { level: string, text: string }) => {
    const level = props.level.toUpperCase()
    const color = colorForLevel(level)
    return <Text backgroundColor={color}>{props.text}</Text>
}

const JSONLogLine = ({ data, lineWidth, x }: JSONLogLineProps) => {
    const timestamp = `${data.ts} `
    const level = data.level
    const message = ` ${data.message}`
    const messageOffset = timestamp.length + level.length
    const max = lineWidth - messageOffset
    const msg = message.substring(x - messageOffset, max + x)
    return <>
        <Box>
            { x < timestamp.length ? <Text color="gray">{timestamp.substring(x)}</Text> : null}
            { x < timestamp.length + level.length ? <LogLevel level={level} text={level.substring(x - timestamp.length)}/> : null}
            { msg.length > 0 ? <Text>{msg}</Text> : <Space/>}
        </Box>
    </>
    // <Text>{messagedata.message.substring(x, lineWidth - data.ts.length - data.level.length - 2 + x)}</Text>
}

export default JSONLogLine
