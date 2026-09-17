export type AdminSidebarProps = {
  open: boolean
  activeItem: string
  onClose: () => void
  onSelect: (item: string) => void
}