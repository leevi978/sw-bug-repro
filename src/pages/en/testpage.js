import React from 'react'
import { Link } from 'gatsby'


export default () => {
  return (
    <div>Test page
      <Link to={'/en/testfolder/secondtest'}>Next page</Link>
    </div>
  )
}