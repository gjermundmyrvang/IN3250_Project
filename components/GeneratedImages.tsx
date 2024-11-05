"use client"
import { Response } from '@/app/page';
import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { GenerateButton } from './Buttons';



export const GeneratedImages = (
  {
    selectedResponse,
    currentPrompt,
  } : {
      selectedResponse?: Response, 
      currentPrompt: string
    }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [note, setNote] = useState("")

    useEffect(() => {
      if (typeof window !== "undefined") {
        const savedNote = localStorage.getItem(`${selectedResponse?.created}`)
        if (savedNote) {
          setNote(savedNote)
        }
        else {
          setNote("")
        }
      }
    }, [selectedResponse])

    const handleImageLoad = () => {
      setIsLoading(false); // Skjuler plassholderen når bildet er lastet
    };

    const handleNote = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNote(event.target.value)
    }
    const handleSaveNote = () => {
      if (typeof window !== "undefined") {
        localStorage.setItem(`${selectedResponse?.created}`, note)
      }
    }

  return (
    <div className="flex w-full justify-start md:flex-row sm:flex-row">
      {/* Bildet */}
      <div className="flex-shrink-0">
        {isLoading && <ImagePlaceholder />}
        {selectedResponse && 
          <Image 
            src={selectedResponse.data[0].url} 
            onLoad={handleImageLoad}
            width={600} 
            height={600} 
            alt="Arne" 
            className="rounded-tl-md rounded-bl-md shadow-md"
            id='arne'
          />
        }
      </div>

      {/* Teksten på høyresiden */}
      <div className="flex-grow flex flex-col p-10 min-h-full rounded-tr-lg rounded-br-lg shadow-lg bg-white">
        {selectedResponse && 
          <div>
            <div className='flex flex-col space-y-4 mb-4'>
              <h1 className="font-extrabold text-2xl underline-offset-2 underline">Notater:</h1>
              <textarea
              value={note}
              onChange={handleNote}
              placeholder='Notater her...'
              className='border p-5 rounded-lg'
              />
              <GenerateButton onClick={handleSaveNote} text='Lagre notat' />
            </div>
            <h1 className="font-extrabold text-2xl underline-offset-2 underline">Siste endringer:</h1>
            <p>{currentPrompt}</p>
          </div>
        }
      </div>
    </div>
  )
}

const ImagePlaceholder = () => {
  return (
      <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
          <div className="flex items-center justify-center w-[600px] h-[600px] bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
              <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
              </svg>
          </div>
      </div>
  )
}
