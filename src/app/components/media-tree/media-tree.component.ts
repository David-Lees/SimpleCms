import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DropInfo, GalleryFolder } from 'src/app/models/gallery-folder';
import { debounce } from '@agentepsilon/decko';
import { CdkDragMove } from '@angular/cdk/drag-drop';
import { FolderService } from 'src/app/services/folder.service';
import {
  faCaretDown,
  faCaretRight,
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faList,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-media-tree',
  templateUrl: './media-tree.component.html',
  styleUrls: ['./media-tree.component.scss'],
})
export class MediaTreeComponent implements OnInit {
  folders: GalleryFolder[];
  @Input() selectedFolder: GalleryFolder;
  @Output() nodesChange = new EventEmitter<GalleryFolder>();
  @Output() selectChange = new EventEmitter<GalleryFolder>();

  expandedNodes = [];

  list = faList;
  folder = faFolder;
  folderOpen = faFolderOpen;
  folderPlus = faFolderPlus;
  caretRight = faCaretRight;
  caretDown = faCaretDown;

  constructor(@Inject(DOCUMENT) private document: Document, private folderService: FolderService) {}

  selectNode(folder: GalleryFolder) {
    this.selectedFolder = folder;
    this.nodeClick(folder);
  }

  ngOnInit() {
    this.expandedNodes.push(this.folderService.empty);
    this.prepareDragDrop();
    this.folderService.getFolders().subscribe(x => {
      console.log('Init media tree', x);
      this.folders = [...x];
      if (!this.selectedFolder) {
        this.selectedFolder = this.folders.find(y => y.rowKey === this.folderService.empty);
      }
      this.selectedNodeId = this.selectedFolder.rowKey;
    });
  }

  // ids for connected drop lists
  dropTargetIds = [];
  dropActionTodo: DropInfo = null;
  selectedNodeId: string;

  isExpanded(id: string) {
    return this.expandedNodes.includes(id);
  }

  getRoot() {
    return this.folders.find(
      x => x.partitionKey === this.folderService.empty && x.rowKey === this.folderService.empty
    );
  }

  getChildren(parentId: string) {
    return this.folders.filter(
      x => x.partitionKey === parentId && x.rowKey !== this.folderService.empty
    );
  }

  hasChildren(parentId: string) {
    return this.getChildren(parentId).length > 0;
  }

  nodeClick(node: GalleryFolder) {
    if (this.expandedNodes.includes(node.rowKey)) {
      this.expandedNodes.splice(this.expandedNodes.indexOf(node.rowKey), 1);
    } else {
      this.expandedNodes.push(node.rowKey);
    }
    this.selectedNodeId = node.rowKey;
    this.selectChange.emit(node);
  }

  prepareDragDrop() {
    if (this.folders && this.folders.length) {
      this.folders.forEach(node => {
        this.dropTargetIds.push(node.rowKey);
      });
    }
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

  // drop(event) {
  //   if (!this.dropActionTodo) return;

  //   const sourceFolder =
  //     event.previousContainer.id === 'main'
  //       ? this.folders
  //       : this.getParentNode(event.previousContainer.id);

  //   const draggedItemId = event.item.data;

  //   let i = this.folders.findIndex(c => c.id === draggedItemId);
  //   const draggedItem = sourceFolder.folders.splice(i, 1)[0];

  //   switch (this.dropActionTodo.action) {
  //     case 'before':
  //     case 'after':
  //       const f = this.getParentNode(this.dropActionTodo.targetId);
  //       f.folders = f.folders || [];
  //       const targetIndex = f.folders.findIndex(c => c.id === this.dropActionTodo.targetId);
  //       if (this.dropActionTodo.action == 'before') {
  //         f.folders.splice(targetIndex, 0, draggedItem);
  //       } else {
  //         f.folders.splice(targetIndex + 1, 0, draggedItem);
  //       }
  //       break;

  //     case 'inside':
  //       const folder = this.getNode(this.dropActionTodo.targetId);
  //       folder.folders.push(draggedItem);
  //       folder.isExpanded = true;
  //       break;
  //   }

  //   this.clearDragInfo(true);
  //   this.nodesChange.emit(this.nodes);
  // }

  // getNode(id: string, nodesToSearch?: GalleryFolder): GalleryFolder {
  //   if (id === 'main') return this.nodes;
  //   if (!nodesToSearch) {
  //     nodesToSearch = this.nodes;
  //   }
  //   if (nodesToSearch.id == id) return nodesToSearch;
  //   for (let node of nodesToSearch.folders) {
  //     let ret = this.getNode(id, node);
  //     if (ret) return ret;
  //   }
  //   return null;
  // }

  // getParentNode(id: string): GalleryFolder {
  //   return this.folders.find(x => x.rowKey === id);
  //}

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
