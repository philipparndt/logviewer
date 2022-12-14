import { Text } from "ink"
import React from "react"

type OptionProps = {
    enabled: boolean
    children?: React.ReactNode
}
const Option = ({ enabled, children }: OptionProps) => {
    return <>
        <Text inverse={enabled} color={enabled ? "yellowBright" : "gray"}>{children}</Text>
    </>
}

export default Option
