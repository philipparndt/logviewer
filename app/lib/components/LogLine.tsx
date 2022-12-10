import { Text } from "ink"
import React from "react"

type LogLineProps = {
    line: string
    lineWidth: number
    x: number
}

const LogLine = (props: LogLineProps) => {
    let text = props.line.substring(props.x, props.lineWidth + props.x)
    if (text.length === 0) {
        text = " "
    }

    return <Text>{text}</Text>
}

export default LogLine
