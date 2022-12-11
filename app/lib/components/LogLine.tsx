import { Text } from "ink"
import React from "react"
import ScrollView from "./ScrollView.js"

type LogLineProps = {
    line: string
    lineWidth: number
    x: number
}

const LogLine = (props: LogLineProps) => {
    return <ScrollView x={props.x} with={props.lineWidth}><Text>{props.line}</Text></ScrollView>
}

export default LogLine
