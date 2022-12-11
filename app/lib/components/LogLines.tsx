import { Box, Text } from "ink"
import React from "react"
import JSONLogLine from "./JSONLogLine.js"
import LogLine from "./LogLine.js"
import Space from "./Space.js"

const LogLines = (props: { curser: number, lines: string[], lineWidth: number, x: number, raw: boolean }) => {
    const logLines = props.lines.map((line, index) => {
        const show = props.curser === index ? <Text color={"blue"}>{">"}</Text> : <Space/>
        if (props.raw) {
            return <Box>
                { show }
                <LogLine key={index} line={line} lineWidth={props.lineWidth} x={props.x}/>
            </Box>
        }
        try {
            const json = JSON.parse(line)
            return <Box>
                { show }
                <JSONLogLine key={index} data={json} lineWidth={props.lineWidth} x={props.x}/>
            </Box>
        }
        catch (e) {
            return <Box>
                { show }
                <LogLine key={index} line={line} lineWidth={props.lineWidth} x={props.x}/>
            </Box>
        }
    })
    return <>{logLines}</>
}

export default LogLines
