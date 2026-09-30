import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const GET_STARTED_ENABLED = true // flip to false, or delete this whole file + its import, to remove the flow entirely

export function GetStartedButton() {
  if (!GET_STARTED_ENABLED) return null

  return (
    <Link href="/get-started">
      <Button className="w-full py-6 text-base" size="lg">
        Get Started
      </Button>
    </Link>
  )
}