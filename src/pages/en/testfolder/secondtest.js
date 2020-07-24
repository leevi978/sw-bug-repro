import React from "react"
import { Link } from 'gatsby'

export default () => {
  return (
    <div>Nested test page
      <Link to={'/en/testfolder/secondtestfolder/thirdtest'}>Next page</Link>
    </div>
  )
}