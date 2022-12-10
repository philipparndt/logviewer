import { Box, Text, useApp, useInput } from "ink"
import React, { useEffect, useState } from "react"
import HotkeyText from "./HotkeyText"
import LogLines from "./LogLines"
import Option from "./Option"
import clipboardy from "clipboardy"
import Markdown from "ink-markdown";
import Separator from "./Separator"

const LogViewer = () => {
    const [message, setMessage] = useState<string | undefined>(undefined)
    const [raw, setRaw] = useState(false)
    const [x, setX] = useState(0)
    const [pageSize, setPageSize] = useState(50)
    const [lineWidth, setLineWidth] = useState(50)
    const [follow, setFollow] = useState(true)
    const [log, setLog] = useState<string[]>([
        "2022-12-10T12:00:00.000Z INFO [main] [main.go:123] Starting up",
        "2022-12-10T12:00:00.000Z INFO [main] [main.go:123] Some",
        "2022-12-10T12:00:00.000Z INFO [main] [main.go:123] More",
        JSON.stringify({ ts: "2022-12-10T12:00:00.000Z", level: "INFO", message: "Some JSON" }),
        JSON.stringify({ ts: "2022-12-10T12:00:00.000Z", level: "ERROR", message: "Uuups something went wrong" }),
        JSON.stringify({ ts: "2022-12-10T12:00:00.000Z", level: "DEBUG", message: "some debug message" })
    ])
    const [logIndex, setLogIndex] = useState(0)

    useEffect(() => {
        const timeout = setTimeout(() => {
            message && setMessage(undefined)
        }, 2000)
        return () => clearTimeout(timeout)
    }, [message])

    useEffect(() => {
        const cb = () => {
            setPageSize(process.stdout.rows - 1)
            setLineWidth(process.stdout.columns - 2)
        }
        const intervalStatusCheck = setInterval(cb, 1000)
        cb()

        return () => {
            clearInterval(intervalStatusCheck)
        }
    }, [])

    const app = useApp()
    useInput((input, key) => {
        if (key.downArrow || input === "j") {
            // setFollow(false)
            setLogIndex((index) => Math.min(index + 1, log.length - pageSize))
        }
        else if (key.upArrow || input === "k") {
            // setFollow(false)
            setLogIndex((index) => Math.max(0, index - 1))
        }
        else if (key.leftArrow || input === "h") {
            setX((x) => Math.max(0, x - 1))
        }
        else if (key.rightArrow || input === "l") {
            setX((x) => x + 1)
        }
        else if (input === "q") {
            app.exit()
            process.exit(0)
        }
        else if (input === "f") {
            if (follow) {
                setFollow(false)
            }
            else {
                setFollow(true)
                setLogIndex(Math.max(log.length - pageSize, 0))
            }
        }
        else if (input === "r") {
            setRaw(!raw)
        }
        else if (input === "g") {
            setLogIndex(0)
        }
        else if (input === "G") {
            setLogIndex(log.length - pageSize)
        }
        else if (input === "H") {
            setX(0)
        }
        else if (input === "c") {
            clipboardy.writeSync(log.join("\n"))
            setMessage("😎 Copied to clipboard")
        }
        else {
            setLog((log) => [...log, JSON.stringify(
                { ts: new Date().toISOString(), level: "DEBUG", message: `You pressed ${input} ${JSON.stringify(key)}` }
            )])

            if (follow) {
                setLogIndex(Math.max(0, log.length - pageSize + 1))
            }
        }
    })

    return <>
        <Box borderStyle="round" flexDirection="column" height={pageSize} paddingX={1}>
            <LogLines lines={log.slice(logIndex, logIndex + pageSize)} lineWidth={lineWidth - 2} x={x} raw={raw}/>
        </Box>

        <Box paddingX={1}>
            {message && <Text>{message}</Text>}
            {!message && <>
                <Option enabled={follow}><HotkeyText>follow</HotkeyText></Option>
                <Separator/>
                <Option enabled={raw}><HotkeyText>raw</HotkeyText></Option>
                <Separator/>
                <Text>{logIndex}/{log.length}</Text>
                <Separator/>
                <HotkeyText>quit</HotkeyText>
                <Separator/>
                <HotkeyText>copy</HotkeyText>
            </>}
        </Box>
    </>
}

export default LogViewer
