import { GalleryImage } from './gallery-image';

export interface GalleryFolder {
  name: string;
  id: string;
  images?: GalleryImage[];
  folders?: GalleryFolder[];
  isExpanded?:boolean;
}

export class Folder {
  constructor(public name: string, public folder: GalleryFolder, public isExpanded?:boolean) {}
}

export interface DropInfo {
    targetId: string;
    action?: string;
}
