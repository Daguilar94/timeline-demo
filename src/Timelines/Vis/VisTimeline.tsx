import { useRef, useEffect, useMemo, useState } from "react";
import { DataSet } from "vis-data/peer";
import { Timeline } from "vis-timeline/peer";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import styles from "./VisTimeline.module.scss";

const VisTimeline: React.FC = () => {
  const items = useMemo(() => new DataSet([
    { id: 1, content: "item 1", start: "2014-04-20" },
    { id: 2, content: "item 2", start: "2014-04-14" },
    { id: 3, content: "item 3", start: "2014-04-18" },
    { id: 4, content: "item 4", start: "2014-04-16", end: "2014-04-19" },
    { id: 5, content: "item 5", start: "2014-04-25" },
    { id: 6, content: "item 6", start: "2014-04-27", type: "point" },
  ]), []);

  // Create a ref to provide DOM access
  const [timelineInstance, setTimelineInstance] = useState<Timeline | null>(null)
  const visJsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timeline = visJsRef.current && new Timeline(visJsRef.current, items);
    setTimelineInstance(timeline)
    // Use `network` here to configure events, etc
  }, [visJsRef, items]);

  const zoom = (level: number) => {
    timelineInstance?.zoomIn(level)
  };

  return (
    <>
      <button
        type="button"
        onClick={() => zoom(0.75)}
        className={styles["zoom-button"]}
      >
        Zoom in
      </button>
      <button
        type="button"
        onClick={() => zoom(1.25)}
        className={styles["zoom-button"]}
      >
        Zoom out
      </button>
      <div ref={visJsRef} />;
    </>
  );
};

export default VisTimeline;
