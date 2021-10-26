import { Component, Inject, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { Site } from 'src/app/models/site';
import { Page } from 'src/app/models/page';
import { MediaService } from 'src/app/services/media.service';
import { CdkDragMove } from '@angular/cdk/drag-drop';
import { v4 as uuidv4 } from 'uuid';
import { DropInfo } from '../../models/gallery-folder';
import { debounce } from '@agentepsilon/decko';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss'],
})
export class AdminViewComponent implements OnInit {
  site: Site;
  loaded = false;
  activePage: Page;

  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private siteService: SiteService,
    private mediaService: MediaService
  ) {}

  save() {
    console.log('saving site', this.site);
    this.siteService.save(this.site);
  }

  load() {
    if (this.siteService.isLoaded) {
      this.site = this.siteService.site;
      if (!this.site.id) this.site.id = uuidv4();
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

  select(event: { node: { data: Page } }) {
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

  nodeClick(node: Page) {
    node.isExpanded = !node.isExpanded;
    this.activePage = node;
  }

  prepareDragDrop(nodes: Site | Page) {
    nodes.pages.forEach(node => {
      this.dropTargetIds.push(node.id);
      this.prepareDragDrop(node);
    });
  }

  @debounce(50)
  dragMoved(event: CdkDragMove<any>) {
    let e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);

    if (!e) {
      this.clearDragInfo();
      return;
    }
    let container = e.classList.contains('node-item') ? e : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id'),
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo['action'] = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo['action'] = 'after';
    } else {
      // inside
      this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }

  drop(event) {
    if (!this.dropActionTodo) return;

    const sourceFolder =
      event.previousContainer.id === 'main'
        ? this.site
        : this.getParentNode(event.previousContainer.id);

    const draggedItemId = event.item.data;

    let i = sourceFolder.pages.findIndex(c => c.id === draggedItemId);
    const draggedItem = sourceFolder.pages.splice(i, 1)[0];

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const f = this.getParentNode(this.dropActionTodo.targetId);
        f.pages = f.pages || [];
        const targetIndex = f.pages.findIndex(c => c.id === this.dropActionTodo.targetId);
        if (this.dropActionTodo.action == 'before') {
          f.pages.splice(targetIndex, 0, draggedItem);
        } else {
          f.pages.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        const folder = this.getNode(this.dropActionTodo.targetId);
        folder.pages.push(draggedItem);
        folder.isExpanded = true;
        break;
    }

    this.clearDragInfo(true);
  }

  getNode(id: string, nodesToSearch?: Site | Page): Site | Page {
    if (id === 'main') return this.site;
    if (!nodesToSearch) {
      nodesToSearch = this.site;
    }
    if (nodesToSearch.id == id) return nodesToSearch;
    for (let node of nodesToSearch.pages) {
      let ret = this.getNode(id, node);
      if (ret) return ret;
    }
    return null;
  }

  getParentNode(id: string, nodesToSearch?: Site | Page): Site | Page {
    if (id === 'main') return this.site;
    if (!nodesToSearch) {
      nodesToSearch = this.site;
    }
    for (let node of nodesToSearch.pages || []) {
      if (node.id == id) return nodesToSearch;
      let ret = this.getParentNode(id, node);
      if (ret) return ret;
    }
    return null;
  }

  deletePage() {
    if (this.activePage && confirm('Are you sure you want to delete this page?')) {
      const sourceFolder = this.getParentNode(this.activePage.id);
      let i = sourceFolder.pages.findIndex(c => c.id === this.activePage.id);
      sourceFolder.pages.splice(i, 1);
    }
  }

  showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      this.document
        .getElementById('node-' + this.dropActionTodo.targetId)
        .classList.add('drop-' + this.dropActionTodo.action);
    }
  }
  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document
      .querySelectorAll('.drop-before')
      .forEach(element => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach(element => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach(element => element.classList.remove('drop-inside'));
  }
}
