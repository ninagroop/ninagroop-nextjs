export interface SubNavItem {
  title: string;
  slug: string;
  description?: string;
}

export interface NavItem {
  title: string;
  slug: string;
  showCartIndicator?: boolean;
  subnav?: SubNavItem[];
}

export interface NavigationConfig {
  nav: NavItem[];
}
