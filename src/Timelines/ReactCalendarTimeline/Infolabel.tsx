import React from 'react'
import {TimelineGroupBase} from 'react-calendar-timeline'
import moment from 'moment'

type InfoLabelType = {
  group: TimelineGroupBase
  time: number
}

export default function InfoLabel({group, time}: InfoLabelType) {
  const date = moment(time, 'x')
  const label = group ? group.title : ''

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
        bottom: 50,
        color: 'white',
        fontSize: 20,
        left: 100,

        padding: 10,
        position: 'fixed',
        zIndex: 85,
      }}
    >
      {`${date.format('LLL')}, ${label}`}
    </div>
  )
}
