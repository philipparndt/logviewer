import { Box, Text } from "ink"
import React from "react"
import yaml from "yaml"
import ScrollView from "./ScrollView.js"

type DetailViewProps = {
    message: string
    with: number
    x: number
}

const DetailView = (props: DetailViewProps) => {
    try {
        const parsed = JSON.parse(props.message)
        const message = yaml.stringify(parsed)
        const lines = message.split("\n")
            .map((line, index) => <Box key={index}>
                <ScrollView x={props.x} with={props.with}>
                    <Text>{line}</Text>
                </ScrollView>
            </Box>)
        return <>{lines}</>
    }
    catch (e) {
        return <Text>{props.message}</Text>
    }
}

export default DetailView
