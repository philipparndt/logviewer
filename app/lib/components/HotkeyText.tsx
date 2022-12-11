import React from "react"
import { Text } from "ink"

type HotkeyTextProps = {
    position?: number
    children: string
}
const HotkeyText: React.FC<HotkeyTextProps> = ({ position, children }) => {
    const pos = position ?? 0
    const start = "<" + children.substring(0, pos)
    const hotkey = children.substring(pos, pos + 1)
    const end = children.substring(pos + 1) + ">"
    return <>
        {start.length > 0 && <Text>{start}</Text>}
        <Text underline>{hotkey}</Text>
        {end.length > 0 && <Text>{end}</Text>}
    </>
}

export default HotkeyText
