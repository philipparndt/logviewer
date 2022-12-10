import { Box } from "ink"
import BigText from "ink-big-text"
import React from "react"
import Gradient from "ink-gradient"

const Logo = () => {
    return (
        <Box justifyContent="center">
            <Gradient name="morning">
                <BigText text="K8S LOGVIEW" />
            </Gradient>
        </Box>)
}

export default Logo
