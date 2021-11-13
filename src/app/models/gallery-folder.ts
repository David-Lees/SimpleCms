export interface GalleryFolder {
  partitionKey: string;
  rowKey: string;
  name: string;

  level?: number;
}

export interface DropInfo {
  targetId: string;
  action?: string;
}
