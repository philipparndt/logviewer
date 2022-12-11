import clipboardy from "clipboardy"
import yaml from "yaml"

const format = (message: string) => {
    try {
        return JSON.parse(message)
    }
    catch (e) {
        return message
    }
}

const stringifyLine = (line: any, yml: boolean) => {
    if (typeof line === "string") {
        return line
    }
    return yml ? yaml.stringify(line) : JSON.stringify(line, null, 2)
}

export const copy = (log: string, yml = false) => {
    const formatted = format(log)
    clipboardy.writeSync(stringifyLine(formatted, yml))
}

export const copyAll = (logs: string[], yml = false) => {
    const formatted = logs.map(log => format(log))
    clipboardy.writeSync(yml ? yaml.stringify(formatted) : formatted.map(line => stringifyLine(line, yml)).join("\n"))
}
