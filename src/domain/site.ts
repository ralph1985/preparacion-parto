export interface NavItem {
  label: string;
  href: string;
}

export interface PageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface SiteSettings {
  lang: string;
  name: string;
  footer: string;
  nav: NavItem[];
}
