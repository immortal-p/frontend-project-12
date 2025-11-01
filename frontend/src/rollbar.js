import Rollbar from '@rollbar/react'

const rollbar = new Rollbar({
    accessToken: localStorage.getItem("token"),
    captureUncaught: true,
    captureUnhandledRejections: true,
})

export default rollbar