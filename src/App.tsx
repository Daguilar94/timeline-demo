import ReactCalendarTimeline from "./Timelines/ReactCalendarTimeline/ReactCalendarTimeline";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles["timelines-wrapper"]}>
      <div className={styles["timeline-container"]}>
        <section className={styles.timeline}>
          <ReactCalendarTimeline />
        </section>
      </div>
    </div>
  );
}

export default App;
