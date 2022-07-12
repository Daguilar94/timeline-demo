import {TimelineGroup, TimelineItem} from 'react-calendar-timeline'
import {add} from 'date-fns'
import moment from 'moment'

export type CustomTimelineItemType = TimelineItem<{
  color: string
  end: number
  start: number
  isPlainText: boolean
}>

export type CustomTimelineGroupType = TimelineGroup<{
  bgColor: string
  root?: boolean
  parent?: number
}>

const responses = ['PD', 'PR']

export default function generateData (
  itemCount = 60,
  intervalDays = 120,
): {groups: CustomTimelineGroupType[]; items: CustomTimelineItemType[]} {
  const groups: CustomTimelineGroupType[] = [
    {
      bgColor: 'white',
      height: 100,
      id: 1,
      title: 'Treatment',
    },
    {
      bgColor: 'white',
      id: 2,
      parent: 0,
      root: true,
      title: 'Lab Tests',
    },
    {
      bgColor: 'white',
      id: 21,
      parent: 2,
      root: false,
      stackItems: false,
      title: 'Chromogranin A',
    },
    {
      bgColor: 'white',
      id: 22,
      parent: 2,
      root: false,
      stackItems: false,
      title: 'EGFR Amplification',
    },
    {
      bgColor: 'white',
      id: 3,
      stackItems: true,
      title: 'Response',
    },
  ]

  const items: CustomTimelineItemType[] = []
  for (let i = 0; i < itemCount; i++) {
    const group = Math.round(Math.random() * 2 + 1)
    // console.log({group})
    let title
    if (group === 1) {
      title = `${Math.floor(Math.random() * 10 + 1)} Cycles`
    } else if (group === 2) {
      title = Math.round(Math.random() * 100)
    } else {
      title = responses[Math.round(Math.random())]
    }
    // console.log({title})
    const startDate = add(new Date(), {days: -intervalDays}).valueOf()
    const endDate = add(new Date(), {days: +intervalDays}).valueOf()
    const startValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000
    const endValue = moment(endDate).valueOf()
    const start = Math.random() * (endValue - startValue) + startValue
    const end = moment(start)
      .add(Math.random() * 10 + 1, 'd')
      .valueOf()
    items.push({
      canMove: true,
      canResize: 'both',
      color: group === 2 ? 'white' : 'black',
      end: group === 2 ? moment(start).endOf('D').valueOf() : end,
      end_time: group === 2 ? moment(start).endOf('D').valueOf() : end,
      // group: group,
      group: group === 2 ? [21, 22][Math.round(Math.random())] : group,
      id: `${i}`,
      isPlainText: group === 2,
      start: group === 2 ? moment(start).startOf('D').valueOf() : start,
      start_time: group === 2 ? moment(start).startOf('D').valueOf() : start,
      title: title,
    })
  }

  return {groups, items}
}
