import React from "react"
import { Link } from 'gatsby'

export default ({ pageContext }) => {
  return <div>
    <h1>Home page</h1>
    <ul>
      {pageContext.links.map(link => (<li><Link to={link}>{link}</Link></li>))}
    </ul>
  </div>
}