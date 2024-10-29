import { ImageNode } from '@/types/ImageContent';
import Image from 'next/image';
import React from 'react';

interface ImageHierarchyProps {
    node: ImageNode | undefined; 
    level?: number;
  }

const imagePath: ImageNode[] = [
{
    id: "root",
    url: "/assets/arne.png",
    prompt: "Start image",
    children: [
    {
        id: "child1",
        url: "/assets/arne.jpg",
        prompt: "Child image 1",
        children: [
        {
            id: "child2",
            url: "/assets/arne.png",
            prompt: "Child image 2",
            children: [],
        },
        {
            id: "child3",
            url: "/assets/arne.jpg",
            prompt: "Child image 3",
            children: [],
        },
        {
            id: "child4",
            url: "/assets/arne.png",
            prompt: "Child image 4",
            children: [
                {
                    id: "child5",
                    url: "/assets/arne.jpg",
                    prompt: "Child image 5",
                    children: [
                        {
                            id: "child6",
                            url: "/assets/arne.png",
                            prompt: "Child image 6",
                            children: [],
                        },
                    ],
                },
            ],
        },
        ],
    },
    ],
},
];

export const ImageHierarchy: React.FC<ImageHierarchyProps> = ({node, level = 0}) => {
    if (node) {
        return (
          <div className="flex flex-col items-start ml-4">
            {/* Vis bildet og beskrivelsen */}
            <div className="flex items-center space-x-4">
              {/* Indentering basert på nivå i hierarkiet */}
              <span className="text-gray-500">{Array(level).fill("→ ").join("")}</span>
              <Image
                src={node.url}
                alt={node.prompt}
                width={84}
                height={84}
                style={ {objectFit: "contain"} }
              />
              <div>
                <p className="font-semibold">{node.prompt}</p>
                <p className="text-xs text-gray-500">ID: {node.id}</p>
              </div>
            </div>
      

            <div className="ml-8">
              {node.children.map((childNode) => (
                <ImageHierarchy key={childNode.id} node={childNode} level={level + 1} />
              ))}
            </div>
          </div>
        )
    }
}
