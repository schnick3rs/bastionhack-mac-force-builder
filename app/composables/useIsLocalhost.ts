/** True when the app is served from the local machine (works on the server and in the browser). */
export function useIsLocalhost(): boolean {
    const hostname = useRequestURL().hostname
    return ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname)
}
