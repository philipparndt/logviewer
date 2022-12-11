import { Text } from "ink"
import React from "react"
import Children from "react-children-utilities"

type ScrollViewProps = {
    x: number
    with: number
    children: React.ReactNode | React.ReactNode[]
}
const ScrollView = (props: ScrollViewProps) => {
    const children = Children.toArray(props.children)
    const elements: React.ReactNode[] = []
    let taken = 0
    let position = 0
    for (const idx in children) {
        if (taken >= props.with) {
            break
        }
        const child: any = children[idx]
        const text = Children.onlyText(child)
        if (text.length > props.x - taken) {
            const spaceLeft = props.with - position + props.x
            const startIndex = props.x - taken
            elements.push(<child.type {...child.props} >{text.substring(startIndex, spaceLeft)}</child.type>)
            taken = props.x
        }
        else {
            taken += text.length
        }
        position += text.length
    }

    if (elements.length === 0) {
        return <Text> </Text>
    }

    return <>{elements}</>
}

export default ScrollView
