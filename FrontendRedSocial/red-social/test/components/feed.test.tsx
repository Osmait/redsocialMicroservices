import { expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Feed } from '@/app/components/feed'

test("Test Render Feed", () => {
  render(<Feed />)
})


