import React from 'react'
import { Link } from 'gatsby'

export default ({ pageContext }) => {
  return <div>
    <h2>{pageContext.title}</h2>
    <ul>
      {pageContext.links.map(link => (<li><Link to={link}>{link}</Link></li>))}
    </ul>
  </div>
}