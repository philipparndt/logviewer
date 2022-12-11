import { Box, Text } from "ink"
import React from "react"
import JSONFormat from "./JSONFormat.js"

type DetailViewProps = {
    message: string
    with: number
}

const DetailView = (props: DetailViewProps) => {
    try {
        const parsed = JSON.parse(props.message)
        let trace = null
        if (parsed.stacktrace) {
            trace = <Box flexDirection="column">
                <Text>{parsed.stacktrace}</Text>
                <Text>{"-".repeat(props.with)}</Text>
            </Box>
        }
        delete parsed.stacktrace
        return <>
            { trace }
            <JSONFormat data={parsed}/>
        </>
    }
    catch (e) {
        return <Text>{props.message}</Text>
    }
}

export default DetailView
