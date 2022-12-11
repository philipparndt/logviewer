#!/usr/bin/env node
import { Command } from "commander"
import React from "react"
import { render } from "ink"
import LogViewer from "./components/LogViewer.js"

const program = new Command()

program
    .name("k8s-logviewer")
    .description("Kubernetes log viewer")
    .version("1.0.0")

program.command("logs")
    .description("Show container logs")
    .argument("<namespace>", "Namespace")
    .argument("<pod>", "Pod")
    .action((namespace: string, pod: string) => {
        render(<>
            <LogViewer namespace={namespace} pod={pod}/>
        </>)
    })

program.showHelpAfterError(true)
program.parse(process.argv)
