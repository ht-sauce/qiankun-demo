interface MenuItemType {
  icon: string
  title: string
  child: Array<MenuItemType>
  url?: string
}
type MenuType = Array<MenuItemType>

export { MenuItemType, MenuType }
