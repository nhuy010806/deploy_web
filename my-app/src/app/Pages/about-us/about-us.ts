import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [RouterLink],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  private readonly router = inject(Router);

  goToPolicy(sectionId: string) {
    void this.router.navigate(['/policy'], { fragment: sectionId });
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 80; // offset for sticky header
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
