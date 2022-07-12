import {ReactNode} from 'react'
import {useHover, useLayer} from 'react-laag'

import styles from './Tooltip.module.scss'

type TooltipProps = {
  children: ReactNode
  text: string
  className?: string
}

export default function Tooltip({children, text, ...props}: TooltipProps) {
  const [isOver, hoverProps] = useHover({delayEnter: 1000})

  const {triggerProps, layerProps, renderLayer} = useLayer({
    isOpen: isOver,
  })

  return (
    <>
      <span {...triggerProps} {...hoverProps} {...props}>
        {children}
      </span>
      {isOver &&
        renderLayer(
          <div {...layerProps} className={styles.tooltip}>
            <p>{text}</p>
            <svg
              className={styles.arrow}
              fill="none"
              height="5"
              viewBox="0 0 10 5"
              width="10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 1H0.421338C0.951771 1 1.46048 1.21071 1.83555 1.58579L2.49976 2.25L4.29266 4.04289C4.68318 4.43342 5.31635 4.43342 5.70687 4.04289L7.49977 2.25L8.16398 1.58579C8.53905 1.21071 9.04776 1 9.57819 1H9.99977"
                stroke="black"
                strokeWidth={0.5}
              />
              <path d="M1 0.549988H9" stroke="white" strokeWidth="1px" />
            </svg>
          </div>,
        )}
    </>
  )
}
