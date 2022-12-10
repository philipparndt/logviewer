import React from "react"
import { Text } from "ink"

type HotkeyTextProps = {
    position?: number
    children: string
}
const HotkeyText = (props: HotkeyTextProps) => {
    const position = props.position ?? 0
    const start = props.children.substring(0, position) + "<"
    const hotkey = props.children.substring(position, position + 1)
    const end = props.children.substring(position + 1) + ">"
    return <>
        {start.length > 0 && <Text>{start}</Text>}
        <Text underline>{hotkey}</Text>
        {end.length > 0 && <Text>{end}</Text>}
    </>
}

export default HotkeyText
