import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import './infobox.css'

function Infobox({ title, cases, total, active, isRed, ...props }) {
  console.log(title, active)
  return (
    <Card
      onClick={props.onClick}
      className={`infobox ${active && 'infobox--selected'} ${
        isRed && 'infobox--red'
      }`}
    >
      <CardContent>
        <Typography color='textSecondary' gutterBottom>
          {title}
        </Typography>
        <h2 className={`infobox__cases ${!isRed && 'infobox__cases--green'}`}>
          {cases}
        </h2>

        <Typography className='infobox__total' color='textSecondary'>
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Infobox
