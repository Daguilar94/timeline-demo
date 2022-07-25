import React from "react";
import {
  ItemContext,
  ReactCalendarItemRendererProps,
} from "react-calendar-timeline";
import classNames from "classnames";

import { CustomTimelineItemType } from "../ReactCalendarTimeline/data";

import styles from "./BlockItem.module.scss";
import Tooltip from "../../Tooltip";

type BlockItemProps = {
  getItemProps: ReactCalendarItemRendererProps<CustomTimelineItemType>["getItemProps"];
  item: CustomTimelineItemType;
  itemContext: ItemContext;
};

export default function BlockItem({
  getItemProps,
  item,
  itemContext,
}: BlockItemProps) {
  return (
    <div
      {...getItemProps({
        className: classNames({
          [styles.blockItem]: !item.isPlainText,
          [styles.singleItem]: item.isPlainText,
          [styles.singleDose]: item.singleDose
        }),
        onMouseDown: () => {
          // console.log('on item click', item)
        },
        style: {
          borderLeftWidth: itemContext.selected ? 3 : 1,
          borderRightWidth: itemContext.selected ? 3 : 1,
          color: item.color,
        },
      })}
    >
      <Tooltip text={itemContext.title}>
        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {itemContext.title}
        </div>
      </Tooltip>
    </div>
  );
}
