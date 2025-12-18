import React from 'react'
import { render } from '@testing-library/react'

export * from '@testing-library/react'

export function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, { ...options })
}

export default customRender
