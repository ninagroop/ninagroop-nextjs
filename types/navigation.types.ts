export interface NavItem {
  title: string;
  slug: string;
  showCartIndicator?: boolean;
}

export interface NavigationConfig {
  nav: NavItem[];
}
