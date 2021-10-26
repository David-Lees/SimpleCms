import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DropInfo, GalleryFolder } from 'src/app/models/gallery-folder';
import { debounce } from '@agentepsilon/decko';
import { CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-media-tree',
  templateUrl: './media-tree.component.html',
  styleUrls: ['./media-tree.component.scss'],
})
export class MediaTreeComponent implements OnInit {
  @Input() nodes: GalleryFolder;
  @Output() nodesChange = new EventEmitter<GalleryFolder>();
  @Output() selectChange = new EventEmitter<GalleryFolder>();

  constructor(@Inject(DOCUMENT) private document: Document) {
  }
  
  ngOnInit() {
    this.prepareDragDrop(this.nodes);
    this.selectedNodeId = this.nodes.id;
  }

  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;
  selectedNodeId: string;

  nodeClick(node: GalleryFolder) {
    node.isExpanded = !node.isExpanded;
    this.selectedNodeId = node.id;
    this.selectChange.emit(node);
  }

  prepareDragDrop(nodes: GalleryFolder) {
    nodes.folders.forEach(node => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
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

    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this.getParentNodeId(
      this.dropActionTodo.targetId,
      this.nodes.folders,
      'main',
    );

    console.log(
      '\nmoving\n[' + draggedItemId + '] from list [' + parentItemId + ']',
      '\n[' +
        this.dropActionTodo.action +
        ']\n[' +
        this.dropActionTodo.targetId +
        '] from list [' +
        targetListId +
        ']',
    );

    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer =
      parentItemId != 'main' ? this.nodeLookup[parentItemId].folders : this.nodes.folders;
    const newContainer =
      targetListId != 'main' ? this.nodeLookup[targetListId].folders : this.nodes.folders;

    let i = oldItemContainer.findIndex(c => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex(c => c.id === this.dropActionTodo.targetId);
        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId].folders.push(draggedItem);
        this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        break;
    }

    this.clearDragInfo(true);
    this.nodesChange.emit(this.nodes);
  }
  getParentNodeId(id: string, nodesToSearch: GalleryFolder[], parentId: string): string {
    for (let node of nodesToSearch) {
      if (node.id == id) return parentId;
      let ret = this.getParentNodeId(id, node.folders, node.id);
      if (ret) return ret;
    }
    return null;
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
