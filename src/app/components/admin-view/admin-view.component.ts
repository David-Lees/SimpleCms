import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { Site } from 'src/app/models/site';
import { Page, TreePage } from 'src/app/models/page';
import { MediaService } from 'src/app/services/media.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastService } from 'src/app/services/toast.service';
import { v4 as uuidv4 } from 'uuid';
import { SelectionModel } from '@angular/cdk/collections';
import { ITreeOptions, ITreeState } from '@circlon/angular-tree-component';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
})
export class AdminViewComponent implements OnInit {
  site: Site;
  loaded = false;
  activePage: Page;
  // expansion model tracks expansion state
  expansionModel = new SelectionModel<string>(true);
  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;
  validateDrop = false;
  constructor(
    private siteService: SiteService,
    private mediaService: MediaService,
    private toastService: ToastService,
  ) {
  }

  state: ITreeState = {
    expandedNodeIds: {},
    hiddenNodeIds: {},
    activeNodeIds: {},
  };

  options: ITreeOptions = {
    allowDrag: (node) => {
      return true;
    },
    allowDrop: (node) => {
      return true;
    },
    useVirtualScroll: true,
    animateExpand: true,
    scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    allowDragoverStyling: true,
    hasChildrenField: 'pages',
    getNodeClone: node => ({
      ...node.data,
      id: uuidv4(),
      name: `copy of ${node.data.name}`,
    }),
  };

  save() {
    console.log('saving site', this.site);
    this.siteService.save(this.site);
  }

  load() {
    if (this.siteService.isLoaded) {
      this.site = this.siteService.site;
      if (!this.site.hasLogo) this.site.hasLogo = false;
      this.loaded = true;
    } else {
      setTimeout(() => this.load(), 20);
    }
  }
  
  ngOnInit() {
    this.load();
    this.mediaService.load();
  }

  change() {
    // do nothing
  }

  select(event: { node: { data: Page; }; }) {
    console.log(event);
    this.activePage = event.node.data;
  }

  add() {
    const p: Page = {
      id: uuidv4(),
      name: 'New page',
      url: 'new-page',
      sections: [],
      pages: [],
    };
    this.site.pages.push(p);
    this.change();
  }

  addChild(page: Page) {
    const p: Page = {
      id: uuidv4(),
      name: 'New page',
      url: 'new-page',
      sections: [],
      pages: [],
    };
    page.pages.push(p);
    this.change();
  }

  remove(x: number) {
    if (this.site.pages.length > 1) {
      this.site.pages = this.site.pages.splice(x);
      this.change();
    }
  }

  dropPage(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.site.pages, event.previousIndex, event.currentIndex);
  }
 

}
