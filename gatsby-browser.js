export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This application has been updated. ` +
    `Reload to display the latest version?`
  )
  if (answer === true) {
    window.location.reload()
  }
}

export const onClientEntry = () => {
  self.onappinstalled = () => {
    self.navigator.serviceWorker.controller.postMessage('onappinstalled')
  }
}
