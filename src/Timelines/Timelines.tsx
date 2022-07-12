import ReactCalendarTimeline from './ReactCalendarTimeline/ReactCalendarTimeline'

import styles from './Timelines.module.scss'

export default function Timelines() {
  return (
    <div className={styles['timelines-wrapper']}>
      <h2 className={styles.title}>
        Timeline Demo
      </h2>
      <div className={styles['timeline-container']}>
        <section className={styles.timeline}>
          <ReactCalendarTimeline />
        </section>
      </div>
    </div>
  )
}
