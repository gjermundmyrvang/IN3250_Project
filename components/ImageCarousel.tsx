"use client";
import { Response } from "@/app/page";
import Image from "next/image";
import { useState } from "react";

export const ImageCarousel = (
    {
        responses, 
        setSelectedResponse: setSelectedResponse,
        selected
    }:{
        responses: Response[], 
        setSelectedResponse: (value: Response) => void,
        selected?: Response
    }
) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        setIsLoading(false); 
      };

  return (
    <div className="relative w-full mx-auto mt-4 overflow-x-hidden">
        <div className="flex flex-row space-x-5 overflow-x-auto">
            {responses.map((response, i) => (
                <>
                {isLoading && <ImagePlaceholder />}
                <div className="flex flex-col" key={i}>
                    <Image 
                    key={i} 
                    onLoad={handleImageLoad}
                    className={`hover:cursor-pointer rounded-md shadow-lg`}
                    src={response.data[0].url} 
                    width={400} height={400} 
                    alt="bilde"
                    onClick={() => {
                        setSelectedResponse(response);
                        console.log(response);
                        }
                    }/>
                    {response == selected && <div className="w-[400px] h-2 mt-2 bg-blue-400 rounded-lg"/>}
                </div>
                </>
            ))}
        </div>
    </div>
  );
}

const ImagePlaceholder = () => {
    return (
        <div role="status" className="space-y-8 w-[400px] h-[400px] animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
            <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
            </div>
        </div>
    )
}