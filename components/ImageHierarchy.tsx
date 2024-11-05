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
    url: "https://images.pexels.com/photos/29087771/pexels-photo-29087771/free-photo-of-stunning-starry-night-over-lake-in-lombardia-italy.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    prompt: "Start image",
    children: [
    {
        id: "child1",
        url: "https://images.pexels.com/photos/29034179/pexels-photo-29034179/free-photo-of-autumn-leaves-on-a-wooden-dock-by-the-water.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        prompt: "Child image 1",
        children: [
        {
            id: "child2",
            url: "/assets/arne.png",
            prompt: "Endre på .....",
            children: [],
        },
        {
            id: "child3",
            url: "/assets/arne.jpg",
            prompt: "Gjør ditten og datten",
            children: [
                {
                    id: "child7",
                    url: "https://images.pexels.com/photos/29034179/pexels-photo-29034179/free-photo-of-autumn-leaves-on-a-wooden-dock-by-the-water.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                    prompt: "Child image 7",
                    children: []
                }
            ],
        },
        {
            id: "child4",
            url: "/assets/arne.png",
            prompt: "Fiks på dette her .......",
            children: [
                {
                    id: "child5",
                    url: "/assets/arne.jpg",
                    prompt: "Behold den men fjern den",
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

export const ImageHierarchy: React.FC<ImageHierarchyProps> = ({node = imagePath[0], level = 0}) => {
    if (node) {
        return (
          <div className="flex flex-col items-start">
            {/* Vis bildet og beskrivelsen */}
            <div className="flex items-center space-x-4">
              {/* Indentering basert på nivå i hierarkiet */}
              <span className="text-gray-500">{Array(level).fill("→ ").join("")}</span>
              <div className='relative w-28 h-28 rounded-lg shadow-lg'>
                <Image
                    src={node.url}
                    alt={node.prompt}
                    style={ {objectFit: "contain"} }
                    layout="fill"
                    className='rounded-lg shadow-lg'
                />
              </div>
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
