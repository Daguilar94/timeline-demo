import {render, screen} from '@testing-library/react'

import Tooltip from './Tooltip'

it('does not render before 1s', () => {
  render(
    <Tooltip text="Test">
      <></>
    </Tooltip>,
  )

  expect(screen.queryByText(/Test/i)).not.toBeInTheDocument()
})
