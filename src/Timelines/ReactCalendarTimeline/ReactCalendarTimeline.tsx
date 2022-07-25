import { createRef, useState } from "react";
import React from "react";
import Timeline, {
  DateHeader,
  OnItemDragObjectMove,
  ReactCalendarGroupRendererProps,
  ReactCalendarItemRendererProps,
  ReactCalendarTimelineProps,
  SidebarHeader,
  TimelineGroupBase,
  TimelineHeaders,
} from "react-calendar-timeline";
import classNames from "classnames";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import BlockItem from "../BlockItem/BlockItem";
import generateFakeData, {
  CustomTimelineGroupType,
  CustomTimelineItemType,
} from "./data";

import "react-calendar-timeline/lib/Timeline.css";
import styles from "./ReactCalendarTimeline.module.scss";
import ReactSelect, { ActionMeta, MultiValue } from "react-select";

type TimelineStateType = ReactCalendarTimelineProps<
  CustomTimelineItemType,
  CustomTimelineGroupType
> & {
  openGroups: { [K: number]: boolean };
  draggedItem?: {
    item?: CustomTimelineItemType;
    group: TimelineGroupBase;
    time: number;
  };
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
      visibleTimeEnd: moment().endOf("Q").valueOf(),
      visibleTimeStart: moment().startOf("Q").valueOf(),
      draggedItem: undefined,
      groups,
      items,
      openGroups: {},
    };
  });
  const [hiddenGroups, setHiddenGroups] = useState<string[]>([])

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

  const onLowerLimitChange = (date: Date) => {
    setState((timelineState) => ({
      ...timelineState,
      visibleTimeStart: moment(date).valueOf(),
    }));
  };

  const onUpperLimitChange = (date: Date) => {
    setState((timelineState) => ({
      ...timelineState,
      visibleTimeEnd: moment(date).valueOf(),
    }));
  };

  const onTimeChange = function (
    visibleTimeStart: number,
    visibleTimeEnd: number
  ) {
    setState((timelineState) => ({
      ...timelineState,
      visibleTimeStart,
      visibleTimeEnd,
    }));
  };

  const onHiddenGroupChange = (newValue: MultiValue<{
    value: React.ReactNode;
    label: React.ReactNode;
}>, actionMeta: ActionMeta<{
    value: React.ReactNode;
    label: React.ReactNode;
}>) => {
    console.log({ newValue });
    const newHiddenGroups = newValue.map(g => g.label) as string[]
    setHiddenGroups(newHiddenGroups)
  }

  const { groups, items, visibleTimeEnd, visibleTimeStart } = state;

  const newGroups: CustomTimelineGroupType[] = groups
    .filter((g) => !hiddenGroups.includes(g.title as string))
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
      <section className={styles["timeline-actions"]}>
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
        <label htmlFor="startDate" className={styles["limit-date"]}>
          <span>Start Date: </span>
          <DatePicker
            id="startDate"
            selected={moment(visibleTimeStart).toDate()}
            onChange={(date: Date) => onLowerLimitChange(date)}
          />
        </label>
        <label htmlFor="endDate" className={styles["limit-date"]}>
          <span>End Date: </span>
          <DatePicker
            id="endDate"
            selected={moment(visibleTimeEnd).toDate()}
            onChange={(date: Date) => onUpperLimitChange(date)}
          />
        </label>
        <label htmlFor="displayedRows" className={styles["hidden-rows"]}>
          <span>Hidden Rows: </span>
          <ReactSelect
            id="displayedRows"
            options={groups.map((g) => ({ value: g.title, label: g.title }))}
            isMulti
            styles={{ menuList: (base) => ({ ...base, zIndex: 1000 }), menu: (base) => ({ ...base, zIndex: 1000}) }}
            onChange={onHiddenGroupChange}
          ></ReactSelect>
        </label>
      </section>
      <Timeline
        canMove={false}
        canResize={false}
        visibleTimeEnd={visibleTimeEnd}
        visibleTimeStart={visibleTimeStart}
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
        onTimeChange={onTimeChange}
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
