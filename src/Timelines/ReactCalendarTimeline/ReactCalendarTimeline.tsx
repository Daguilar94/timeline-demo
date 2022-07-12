import { createRef, useState } from "react";
import React from "react";
import Timeline, {
  DateHeader,
  OnItemDragObjectMove,
  ReactCalendarGroupRendererProps,
  ReactCalendarItemRendererProps,
  SidebarHeader,
  TimelineGroupBase,
  TimelineHeaders,
} from "react-calendar-timeline";
import classNames from "classnames";
import moment from "moment";

import BlockItem from "../BlockItem/BlockItem";
import generateFakeData, {
  CustomTimelineGroupType,
  CustomTimelineItemType,
} from "./data";

import "react-calendar-timeline/lib/Timeline.css";
import styles from "./ReactCalendarTimeline.module.scss";

type TimelineStateType = {
  defaultTimeEnd: Date;
  defaultTimeStart: Date;
  draggedItem?: {
    item?: CustomTimelineItemType;
    group: TimelineGroupBase;
    time: number;
  };
  groups: CustomTimelineGroupType[];
  items: CustomTimelineItemType[];
  openGroups: { [K: number]: boolean };
};

const keys = {
  groupIdKey: "id",
  groupLabelKey: "title",
  groupRightTitleKey: "rightTitle",
  groupTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemIdKey: "id",
  itemTimeEndKey: "end",
  itemTimeStartKey: "start",
  itemTitleKey: "title",
};

export default function ReactCalendarTimeline() {
  const timeline = createRef<
    Timeline<CustomTimelineItemType, CustomTimelineGroupType> & {
      changeZoom: (factor: number) => void;
      zoomIn: () => void;
      zoonOut: () => void;
    }
  >();
  const [state, setState] = useState<TimelineStateType>(() => {
    const { groups, items } = generateFakeData();
    return {
      defaultTimeEnd: moment().endOf("Q").toDate(),
      defaultTimeStart: moment().startOf("Q").toDate(),
      draggedItem: undefined,
      groups,
      items,
      openGroups: {},
    };
  });

  const itemRenderer: (
    props: ReactCalendarItemRendererProps<CustomTimelineItemType>
  ) => React.ReactNode = ({ item, itemContext, getItemProps }) => {
    return (
      <BlockItem
        getItemProps={getItemProps}
        item={item}
        itemContext={itemContext}
      />
    );
  };

  const groupRenderer: (
    props: ReactCalendarGroupRendererProps<CustomTimelineGroupType>
  ) => React.ReactNode = ({ group }) => {
    return (
      <div className={styles.group}>
        <span>{group.title}</span>
      </div>
    );
  };

  const handleItemMove = (
    itemId: number,
    dragTime: number,
    newGroupOrder: number
  ) => {
    const { items, groups } = state;

    const group = groups[newGroupOrder];

    setState((state) => ({
      ...state,
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              end: dragTime + (item.end - item.start),
              group: group.id,
              start: dragTime,
            })
          : item
      ),
    }));

    // console.log('Moved', itemId, dragTime, newGroupOrder)
  };

  const handleItemResize = (itemId: number, time: number, edge: string) => {
    const { items } = state;

    setState((state) => ({
      ...state,
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              end: edge === "left" ? item.end : time,
              start: edge === "left" ? time : item.start,
            })
          : item
      ),
    }));

    // console.log('Resized', itemId, time, edge)
  };

  const handleItemDrag = ({
    itemId,
    time,
    newGroupOrder,
  }: OnItemDragObjectMove) => {
    // console.log('Dragged')

    let item = state.draggedItem ? state.draggedItem.item : undefined;
    if (!item) {
      item = state.items.find((i) => i.id === itemId);
    }
    setState((state) => ({
      ...state,
      draggedItem: { group: state.groups[newGroupOrder], item: item, time },
    }));
  };

  const { groups, items, defaultTimeStart, defaultTimeEnd } = state;

  const toggleGroup = (id: CustomTimelineGroupType["id"]) => {
    const { openGroups } = state;
    setState((prevState) => ({
      ...prevState,
      openGroups: {
        ...openGroups,
        [id]: !openGroups[id as number],
      },
    }));
  };

  const newGroups: CustomTimelineGroupType[] = groups
    .filter((g) => !g.parent || state.openGroups[g.parent])
    .map((group) => {
      if (group.root) {
        return Object.assign({}, group, {
          title: group.root ? (
            <button
              onClick={() => toggleGroup(group.id)}
              style={{ cursor: "pointer" }}
              className={styles["group-button"]}
            >
              {state.openGroups[group.id as number] ? "[-]" : "[+]"}{" "}
              {group.title}
            </button>
          ) : (
            <div style={{ paddingLeft: 20 }}>{group.title}</div>
          ),
        });
      }

      return group;
    });

  const zoom = (level: number) => {
    timeline.current?.changeZoom(level);
  };

  return (
    <div className={styles.vtbTimeline}>
      <div>
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
      </div>
      <Timeline
        canMove={false}
        canResize={false}
        defaultTimeEnd={defaultTimeEnd}
        defaultTimeStart={defaultTimeStart}
        groupRenderer={groupRenderer}
        groups={newGroups}
        horizontalLineClassNamesForGroup={() => [styles.horizontalGroupLines]}
        itemHeightRatio={1}
        itemRenderer={itemRenderer}
        itemTouchSendsClick={false}
        items={items}
        keys={keys}
        minZoom={60 * 60 * 24 * 30 * 1000}
        onItemDrag={handleItemDrag}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        ref={timeline}
        sidebarWidth={200}
        stackItems
        verticalLineClassNamesForTime={() => [styles.verticalTimeLines]}
      >
        <TimelineHeaders
          calendarHeaderClassName={styles.calendarHeader}
          className={styles.timelineHeader}
        >
          <SidebarHeader>
            {({ getRootProps }) => {
              return (
                <div
                  {...getRootProps({
                    style: {
                      backgroundColor: "white",
                    },
                  })}
                />
              );
            }}
          </SidebarHeader>
          <DateHeader
            className={classNames(
              styles.dateHeader,
              styles["dateHeader--main"]
            )}
            unit="primaryHeader"
          />
          <DateHeader
            className={classNames(
              styles.dateHeader,
              styles["dateHeader--secondary"]
            )}
          />
        </TimelineHeaders>
      </Timeline>
    </div>
  );
}
