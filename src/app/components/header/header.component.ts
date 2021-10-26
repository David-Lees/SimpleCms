import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Site } from 'src/app/models/site';
import { environment } from 'src/environments/environment';

const debounce = (fn: any) => {
  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame: number;

  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params: any) => {
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) {
      cancelAnimationFrame(frame);
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {
      // Call our function and pass any params we received
      fn(...params);
    });
  };
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  public isMenuCollapsed = true;

  @Input() site: Site;

  ngOnInit() {
    document.addEventListener('scroll', debounce(this.storeScroll), { passive: true });
    this.storeScroll();
  }

  // Reads out the scroll position and stores it in the data attribute
  // so we can use it in our stylesheets
  storeScroll() {
    document.documentElement.dataset.scroll = window.scrollY.toString();
  }

  logo() {
    return environment.storageUrl + '/images/logo.png';
  }
}
