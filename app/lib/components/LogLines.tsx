import React from "react"
import JSONLogLine from "./JSONLogLine.js"
import LogLine from "./LogLine.js"

const LogLines = (props: { lines: string[], lineWidth: number, x: number, raw: boolean }) => {
    const logLines = props.lines.map((line, index) => {
        if (props.raw) {
            return <LogLine key={index} line={line} lineWidth={props.lineWidth} x={props.x}/>
        }
        try {
            const json = JSON.parse(line)
            return <JSONLogLine key={index} data={json} lineWidth={props.lineWidth} x={props.x}/>
        }
        catch (e) {
            return <LogLine key={index} line={line} lineWidth={props.lineWidth} x={props.x}/>
        }
    })
    return <>{logLines}</>
}

export default LogLines
