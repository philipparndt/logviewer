import { Box, Text, useApp, useInput } from "ink"
import React, { useEffect, useState } from "react"
import { copy, copyAll } from "../copy.js"
import HotkeyText from "./HotkeyText.js"
import LogLines from "./LogLines.js"
import Option from "./Option.js"
import Separator from "./Separator.js"
import DetailView from "./DetailView.js"

const LogViewer = () => {
    const [detailView, setDetailView] = useState(false)
    const [startIndex, setStartIndex] = useState(0)
    const [cursor, setCursor] = useState(0)
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
    const moveCursorToEnd = (length = log.length) => {
        if (length > pageSize) {
            setStartIndex(length - pageSize)
            setCursor(pageSize - 1)
        }
        else {
            setCursor(length - 1)
        }
    }

    const moveCursor = (amount: number) => {
        const next = cursor + amount
        setCursor(Math.max(0, Math.min(next, pageSize - 1, log.length - 1)))
        if (next >= pageSize) {
            setStartIndex(Math.min(startIndex + 1, log.length - pageSize))
        }
        if (next < 0) {
            setStartIndex(Math.max(0, startIndex - 1))
        }
    }

    useInput((input, key) => {
        if (input === "0") {
            setCursor(0)
        }
        else if (input === "9") {
            setCursor(pageSize - 1)
        }
        else if (input === "2" || input === "j") {
            // setFollow(false)
            setStartIndex(Math.min(startIndex + 1, log.length - pageSize))
        }
        else if (input === "8" || input === "k") {
            // setFollow(false)
            setStartIndex(Math.max(0, startIndex - 1))
        }
        else if (key.downArrow) {
            moveCursor(1)
        }
        else if (key.upArrow) {
            moveCursor(-1)
        }
        else if (key.pageDown) {
            moveCursor(pageSize)
        }
        else if (key.pageUp) {
            moveCursor(-pageSize)
        }
        else if (key.leftArrow || input === "h") {
            setX((x) => Math.max(0, x - 10))
        }
        else if (key.rightArrow || input === "l") {
            setX((x) => x + 10)
        }
        else if (input === " ") {
            setDetailView(!detailView)
            setX(0)
        }
        else if (key.escape) {
            setDetailView(false)
            setX(0)
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
                moveCursorToEnd()
            }
        }
        else if (input === "r") {
            setRaw(!raw)
        }
        else if (input === "g") {
            setCursor(0)
        }
        else if (input === "G") {
            setCursor(log.length - pageSize)
        }
        else if (input === "H") {
            setX(0)
        }
        else if (input === "c") {
            if (detailView) {
                copy(log[cursor])
            }
            else {
                copyAll(log)
            }
            setMessage("😎 Copied to clipboard")
        }
        else if (input === "y") {
            if (detailView) {
                copy(log[cursor], true)
            }
            else {
                copyAll(log, true)
            }
            setMessage("😎 Copied YAML to clipboard")
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
                moveCursorToEnd(log.length + 1)
            }
        }
    })

    return <>
        <Box borderStyle="round" borderColor="gray" flexDirection="column" height={pageSize + 2} paddingRight={1} paddingLeft={detailView ? 1 : 0}>
            { detailView && <DetailView x={x} message={log[cursor + startIndex]} with={lineWidth - 2}/> }
            { !detailView && <LogLines curser={cursor} lines={log.slice(startIndex, startIndex + pageSize)} lineWidth={lineWidth - 2} x={x} raw={raw}/> }
        </Box>

        <Box paddingX={1}>
            {message && <Text>{message}</Text>}
            {!message && <>
                <Option enabled={follow}><HotkeyText>follow</HotkeyText></Option>
                <Separator/>
                <Option enabled={raw}><HotkeyText>raw</HotkeyText></Option>
                <Separator/>
                <Text>{cursor + 1 + startIndex}/{log.length}</Text>
                <Separator/>
                <HotkeyText>quit</HotkeyText>
                <Separator/>
                <HotkeyText>copy</HotkeyText>
                <Separator/>
                <HotkeyText position={5}>copy yaml</HotkeyText>
            </>}
        </Box>
    </>
}

export default LogViewer
