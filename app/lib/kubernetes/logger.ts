//     const log = new Log(kc)
//
//     const namespace = "kube-system"
//     const pod = "svclb-traefik-9564eb4c-t2p7s"
//     const podObj = await k8sApi.readNamespacedPod(pod, namespace)
//     const names = (podObj.body.status?.containerStatuses ?? []).map(s => s.name)
//     console.log(names)
//     for (const container of names) {
//         const logStream = new LineStream()
//         logStream.on("data", (data: any) => console.log(container, data.toString()))
//         log.log(namespace, pod, container, logStream, {
//             follow: true,
//             tailLines: 1000,
//             timestamps: true
//         }).then()
//     }

import { Log } from "@kubernetes/client-node"
import { LineStream } from "byline"
import { k8sApi, kc } from "./api.js"

export type Pod = {
    namespace: string
    name: string
}

export type LogMessage = {
    container: string
    message: string
}

export const registerLogger = async (pod: Pod, onMessage: ((logMessage: LogMessage) => void)) => {
    const log = new Log(kc)

    const podObj = await k8sApi.readNamespacedPod(pod.name, pod.namespace)
    const names = (podObj.body.status?.containerStatuses ?? []).map(s => s.name)
    for (const container of names) {
        const logStream = new LineStream()
        logStream.on("data", (data: any) => onMessage({ container, message: data.toString() }))
        log.log(pod.namespace, pod.name, container, logStream, {
            follow: true,
            tailLines: 1000,
            timestamps: true
        }).then().catch(e => onMessage({ container, message: `disconnected, ${e}` }))
    }
}
