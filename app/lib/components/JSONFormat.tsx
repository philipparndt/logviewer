import React from "react"
import { Box, Text } from "ink"

type JSONFormatProps = {
    data: any
}
const JSONFormat = ({ data }: JSONFormatProps) => {
    const text = JSON.stringify(data, null, 2)
    const lines = text.split("\n")
        .map((line, index) => {
            const segments = line.split(/(".*?")/g).map((part, index) => {
                if (index % 2 === 1) {
                    return <Text color="blue">{part}</Text>
                }
                return <Text>{part}</Text>
            })
            return <Box key={index}>
                <Text>{segments}</Text>
            </Box>
        })

    // return <Text>{text}</Text>
    return <Box flexDirection="column">
        {lines}
    </Box>
}

export default JSONFormat
