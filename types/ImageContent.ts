export type ImageNode = {
    id: string;
    url: string;
    prompt: string;
    parentId?: string | null; 
    children: ImageNode[];
}


export class ImageTree {
    root: ImageNode;
    nodes: Map<string, ImageNode>;
  
    constructor(rootImage: ImageNode) {
      this.root = rootImage;
      this.nodes = new Map();
      this.nodes.set(rootImage.id, rootImage);
    }
  
    addImage(parentId: string, newImage: ImageNode): boolean {
      const parentNode = this.nodes.get(parentId);
      if (!parentNode) {
        console.error(`Parent with ID ${parentId} not found`);
        return false;
      }
      parentNode.children.push(newImage);
      this.nodes.set(newImage.id, newImage);
      return true;
    }
  
    // Finn et bilde-node basert på ID
    findImageById(id: string): ImageNode | undefined {
      return this.nodes.get(id);
    }
  
    // Hent hele grenen som starter fra et spesifikt bilde
    getBranch(id: string): ImageNode | undefined {
      return this.nodes.get(id);
    }

    findLongestPath(node: ImageNode): ImageNode[] {
        if (node.children.length === 0) return [node]; 
      
        let longestPath: ImageNode[] = [];
      
        for (const child of node.children) {
          const path = this.findLongestPath(child);
          if (path.length > longestPath.length) {
            longestPath = path;
          }
        }
      
        return [node, ...longestPath];
      }
  }