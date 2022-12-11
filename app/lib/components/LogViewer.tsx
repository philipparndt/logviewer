import { Box, Text, useApp, useInput } from "ink"
import React, { useEffect, useState } from "react"
import HotkeyText from "./HotkeyText.js"
import LogLines from "./LogLines.js"
import Option from "./Option.js"
import clipboardy from "clipboardy"
import Separator from "./Separator.js"
import DetailView from "./DetailView.js"

const LogViewer = () => {
    const [detailView, setDetailView] = useState(false)
    const [message, setMessage] = useState<string | undefined>(undefined)
    const [raw, setRaw] = useState(false)
    const [x, setX] = useState(0)
    const [pageSize, setPageSize] = useState(50)
    const [lineWidth, setLineWidth] = useState(50)
    const [follow, setFollow] = useState(true)
    const [log, setLog] = useState<string[]>([
        JSON.stringify({ ts: "2022-12-10T12:00:00.000Z", level: "INFO", message: "Some JSON", number: 123, array: [1, 2, 3], object: { a: 1, b: 2, c: 3 } }),
        "2022-12-10T12:00:00.000Z INFO [main] [main.go:123] 1 Starting up",
        "2022-12-10T12:00:00.000Z INFO [main] [main.go:123] 2 Some",
        "2022-12-10T12:00:00.000Z INFO [main] [main.go:123] 3 More",
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
            setPageSize(process.stdout.rows - 3)
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
            setLogIndex((index) => Math.min(index + 1, Math.max(0, log.length - 1)))
        }
        else if (key.upArrow || input === "k") {
            // setFollow(false)
            setLogIndex((index) => Math.max(0, index - 1))
        }
        else if (key.leftArrow || input === "h") {
            setX((x) => Math.max(0, x - 10))
        }
        else if (key.rightArrow || input === "l") {
            setX((x) => x + 10)
        }
        else if (input === " ") {
            setDetailView(!detailView)
        }
        else if (key.escape) {
            setDetailView(false)
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
            if (detailView) {
                clipboardy.writeSync(log[logIndex])
            }
            else {
                clipboardy.writeSync(log.join("\n"))
            }
            setMessage("😎 Copied to clipboard")
        }
        else {
            setLog((log) => [...log, JSON.stringify(
                {
                    ts: new Date().toISOString(),
                    level: "DEBUG",
                    message: `You pressed ${input}`,
                    stacktrace: (new Error("some error")).stack
                }
            )])

            if (follow) {
                setLogIndex(Math.max(0, log.length - pageSize + 1))
            }
        }
    })

    const selected = log[logIndex]

    return <>
        <Box borderStyle="round" borderColor="gray" flexDirection="column" height={pageSize + 2} paddingX={1}>
            { detailView && <DetailView message={selected} with={lineWidth - 2}/> }
            { !detailView && <LogLines lines={log.slice(logIndex, logIndex + pageSize)} lineWidth={lineWidth - 2} x={x} raw={raw}/> }
        </Box>

        <Box paddingX={1}>
            {message && <Text>{message}</Text>}
            {!message && <>
                <Option enabled={follow}><HotkeyText>follow</HotkeyText></Option>
                <Separator/>
                <Option enabled={raw}><HotkeyText>raw</HotkeyText></Option>
                <Separator/>
                <Text>{logIndex + 1}/{log.length}</Text>
                <Separator/>
                <HotkeyText>quit</HotkeyText>
                <Separator/>
                <HotkeyText>copy</HotkeyText>
            </>}
        </Box>
    </>
}

export default LogViewer
