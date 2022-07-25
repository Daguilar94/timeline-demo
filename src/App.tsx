import ReactCalendarTimeline from "./Timelines/ReactCalendarTimeline/ReactCalendarTimeline";
import styles from "./App.module.scss";
import VisTimeline from "./Timelines/Vis/VisTimeline";

function App() {
  return (
    <div className={styles["timelines-wrapper"]}>
      <div className={styles["timeline-container"]}>
        <section className={styles.timeline}>
          <ReactCalendarTimeline />
        </section>
        {/* <section className={styles.timeline}>
          <VisTimeline />
        </section> */}
      </div>
    </div>
  );
}

export default App;
