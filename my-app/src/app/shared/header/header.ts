import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  link: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly navItems: NavItem[] = [
    { label: 'SÁCH MỚI', link: '/homepage' },
    { label: 'SÁCH ĐIỆN TỬ', link: '/sach-dien-tu' },
    { label: 'SÁCH CŨ', link: '/sach-cu' },
    { label: 'FLASH SALES', link: '/flash-sales' },
    { label: 'GÓC TÁC GIẢ', link: '/authors' },
    { label: 'VỀ CHÚNG TÔI', link: '/about-us' },
    { label: 'LIGHTBOOK NEWS', link: '/news' },
    { label: 'THANH LÝ SÁCH', link: '/clearance' },
  ];
}
