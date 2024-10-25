"use client";
import { Response } from "@/app/page";
import Image from "next/image";
import { useState } from "react";

export const ImageCarousel = (
    {
        responses, 
        setSelectedResponse,
        selected
    }:{
        responses: Response[], 
        setSelectedResponse: (value: Response) => void,
        selected?: Response
    }
) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleImageLoad = () => {
        setIsLoading(false); 
    };

    return (
        <div className="w-full flex overflow-x-auto space-x-5 py-5">
                <div></div>
                {responses.map((response, i) => (
                    <div className="relative w-[400px] flex flex-col py-4" key={i}>
                        {isLoading? 
                        <ImagePlaceholder />
                        :
                        <div className="w-[400px]">
                            <Image 
                                onLoad={handleImageLoad}
                                className="hover:cursor-pointer rounded-md shadow-lg object-cover"
                                src={response.data[0].url} 
                                width={400} 
                                height={400} 
                                layout="fixed" 
                                alt={`Image ${i + 1}`} 
                                onClick={() => {
                                    setSelectedResponse(response);
                                    console.log(response);
                                }}
                            />
                            {response.created === selected?.created && (
                                <div className="mt-5 w-full bg-blue-500 rounded-lg h-5 shadow-lg" />
                            )}
                            {/* Image label */}
                            <div className="absolute top-0 -right-2 w-20 h-20 rounded-full bg-blue-500 z-10 justify-center items-center flex">
                                <p className="text-white text-3xl font-bold">{i + 1}</p>
                            </div>
                        </div>
                        }
                    </div>
                ))}
        </div>
    );
}

const ImagePlaceholder = () => {
    return (
        <div role="status" className="w-[400px] h-[400px] animate-pulse flex items-center justify-center bg-gray-300 rounded">
            <svg className="w-[200px] h-[200px] text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
            </svg>
        </div>
    );
}