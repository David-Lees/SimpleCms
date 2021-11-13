import { debounce } from '@agentepsilon/decko';
import { CdkDragMove } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  faCaretDown,
  faCaretRight,
  faEllipsisH,
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { DropInfo } from 'src/app/models/gallery-folder';
import { Page } from 'src/app/models/page';
import { Site } from 'src/app/models/site';
import { MediaService } from 'src/app/services/media.service';
import { SiteService } from 'src/app/services/site.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
})
export class AdminContentComponent implements OnInit {
  showPages = true;
  list = faList;
  activePage: Page;
  site: Site;
  loaded = false;
  ellipse = faEllipsisH;
  folder = faFolder;
  folderOpen = faFolderOpen;
  folderPlus = faFolderPlus;
  caretRight = faCaretRight;
  caretDown = faCaretDown;
  expandedNodes = [];

  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private siteService: SiteService,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  addPage() {
    this.site.pages.push(this.newPage());
  }

  addChild(page: Page) {
    page.pages.push(this.newPage());
  }

  canDelete() {
    return false;
  }

  newPage(): Page {
    return {
      id: uuidv4(),
      name: 'New page',
      url: 'new-page',
      sections: [],
      pages: [],
    };
  }

  remove(x: number) {
    if (this.site.pages.length > 1) {
      this.site.pages = this.site.pages.splice(x);
    }
  }

  save() {
    this.siteService.save(this.site);
  }

  load() {
    if (this.siteService.isLoaded) {
      this.site = this.siteService.site;
      if (!this.site.id) this.site.id = uuidv4();
      if (!this.site.hasLogo) this.site.hasLogo = false;
      this.loaded = true;
      if (this.site.pages && this.site.pages.length) {
        this.activePage = this.site.pages[0];
      }
    } else {
      setTimeout(() => this.load(), 20);
    }
  }

  isExpanded(id: string) {
    return this.expandedNodes.includes(id);
  }

  nodeClick(node: Page) {
    if (this.expandedNodes.includes(node.id)) {
      this.expandedNodes.splice(this.expandedNodes.indexOf(node.id), 1);
    } else {
      this.expandedNodes.push(node.id);
    }
    var p = this.getNode(node.id);
    this.activePage = p as Page;
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

  drop(event: any) {
    console.log('drop', event, this.dropActionTodo);
    if (!this.dropActionTodo) return;

    const sourcePage =
      event.previousContainer.id === 'main'
        ? this.site
        : this.getParentNode(event.previousContainer.id);

    console.log('sourcePage', event.previousContainer.id, sourcePage);
    const draggedItemId = event.item.data;

    let i = sourcePage.pages.findIndex(c => c.id === draggedItemId);
    const draggedItem = sourcePage.pages.splice(i, 1)[0];
    console.log('draggedItem', draggedItem);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const f = this.getParentNode(this.dropActionTodo.targetId);
        f.pages = f.pages || [];
        const targetIndex = f.pages.findIndex(c => c.id === this.dropActionTodo.targetId);
        console.log('before/after', f, targetIndex);
        if (this.dropActionTodo.action == 'before') {
          f.pages.splice(targetIndex, 0, draggedItem);
        } else {
          f.pages.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        const folder = this.getNode(this.dropActionTodo.targetId);
        console.log('inside', folder);
        folder.pages.push(draggedItem);
        if (!this.expandedNodes.includes(folder.id)) {
          this.expandedNodes.push(folder.id);
        }
        break;
    }

    this.clearDragInfo(true);
  }

  getNode(id: string, nodesToSearch?: Site | Page): Site | Page {
    if (id === 'main') return this.site;
    if (!nodesToSearch) {
      nodesToSearch = this.site;
    }
    if (nodesToSearch.id === id) return nodesToSearch;
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
      if (node.id === id) return nodesToSearch;
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
