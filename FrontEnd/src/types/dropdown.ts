import type { ComponentType } from 'react'

export type DropdownOption = {
  label: string
  value: string
}

export type DropdownProps = {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  ariaLabel: string
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>
  className?: string
}