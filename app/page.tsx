"use client"
import { BlockQ } from "@/components/BlockQ";
import { GenerateButton, LoadingButton } from "@/components/Buttons";
import ExpandableTextarea from "@/components/ExpandableTextArea";
import { GeneratedImages } from "@/components/GeneratedImages";
import { ImageCarousel } from "@/components/ImageCarousel";
import { QuestionModal } from "@/components/Modal";
import { Sidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import jsPDF from "jspdf";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactDOMServer from 'react-dom/server';


const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const AI_MODEL = "gpt-4o"
const IMAGE_MODEL = "dall-e-3"
const SYSTEM_MSG = {
  role: "system",
  content: `Du skal hjelpe designere å fasilitere en workshop sammen med eldre deltakere (70+ år). Hensikten med workshopen er å bruke AI (DALL-E) til å generere bidler og forslag som skal hjelpe med å utvide de eldre sine forestillingsevne. Eldre har ofte ikke de beste mentale modellene rundt teknologi og derfor må innhold som genereres tilpasses deretter. Sørg for at bildene reflekter det brukeren gir inn som input. Sørg for at bildene ser realistiske ut.`
}

const MIN_IMAGES = 1
const MAX_IMAGES = 4

export interface Response {
    created: number,
    data: [
        {
            revised_prompt: string,
            url: string
        }
    ]
}

interface Message {
  role: string,
  content: Content[]
}

interface Content {
  type: string,
  text?: string,
  image_url?: {
    url: string
  }
}








/* const responses: Response[] = [
  {
    created: 1,
    data: [
      {
        revised_prompt: "morn morn morn",
        url: "/assets/arne.jpg"
      }
    ]
  },
  {
    created: 2,
    data: [
      {
        revised_prompt: "morn morn morn",
        url: "/assets/arne.jpg"
      }
    ]
  },
  {
    created: 3,
    data: [
      {
        revised_prompt: "morn morn morn",
        url: "/assets/arne.png"
      }
    ]
  },
  {
    created: 4,
    data: [
      {
        revised_prompt: "morn morn morn",
        url: "/assets/arne.jpg"
      }
    ]
  },
  {
    created: 5,
    data: [
      {
        revised_prompt: "morn morn morn",
        url: "/assets/arne.png"
      }
    ]
  },
  {
    created: 6,
    data: [
      {
        revised_prompt: "morn morn morn",
        url: "/assets/arne.jpg"
      }
    ]
  },
  {
    created: 7,
    data: [
      {
        revised_prompt: "morn morn morn",
        url: "/assets/arne.png"
      }
    ]
  },
]  */



export default function Home() {
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [promptFromAI, setPromptFromAI] = useState("") 
  const [promptInput, setPromptInput] = useState("")
  const [numImages, setNumImages] = useState(1)
  const [generatedResponses, setGeneratedResponses] = useState<Response[]>(() => {
    if (typeof window !== "undefined") {
      const savedResponses = localStorage.getItem("generatedImages");
      if (savedResponses) {
        const parsedResponses: Response[] = JSON.parse(savedResponses);
        return parsedResponses
      }
      return []
    }
    return []
  })
  const [selectedResponse, setSelectedResponse] = useState<Response | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [scenario, setScenario] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (promptFromAI) {
      handleNewPrompt(promptFromAI);
    }
  }, [promptFromAI]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("generatedImages", JSON.stringify(generatedResponses))
    }
  }, [generatedResponses]);

  const removeLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("generatedImages");
    }
  }

  const handleNewPrompt = async (prompt: string) => {
    if (numImages > MAX_IMAGES) {
      alert("Max 8 bilder!")
      return
    }
    if (numImages < MIN_IMAGES) {
      alert("Minst ett bilde!")
      return
    }

    const displayPrompt = currentPrompt === "" ? scenario : currentPrompt
    setPromptInput(displayPrompt);
    
    setLoading(true)
    for (let i = 0; i < numImages; i++) {
      await sendPromptToAI(prompt);
    }
    setLoading(false)
    
    setSelectedResponse(generatedResponses[0])    
    setCurrentPrompt("");
    setNumImages(1);
  }

  const handleGenerateScenario = async () => {
    console.log(scenario)
    const prompt = `Based on the follwing scenario: ${scenario}. Create an image-prompt that will be given to dall-e with the purpose of generating an image that represents a possibl solotion to the problem the scenario describes. Return only your generated prompt!`

    const newMessage = {
      role: "user",
      content: [
        {
          type: "text",
          text: prompt
        }
      ]
        
    }
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    const apiRequestBody = {
      "model": AI_MODEL,
      "messages": [
        ...newMessages 
      ],
    }
    
    await fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body:JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json()
      }).then((data) => {
        console.log(data)
        try {
          const assistantResponse = {
            role: 'assistant',
            content: data.choices[0].message.content
          };
          setMessages((prev) => [...prev, assistantResponse]);
          setPromptFromAI(assistantResponse.content);
        }
        catch (e) {
          console.error("Error chatcompletion: ", e)
        }
      }) 
  }

  const handleNewImagePrompt = async () => { 
    if (!selectedResponse) {
      return
    }
    const newContent: Content[] = [
      {
        type: "text",
        text: `Analyser og lag en detaljert beskrivelse av bildet. Deretter inkluder disse kravene i beskrivelsen: ${currentPrompt}. Returner kun den nye beskrivelsen`
      },
      {
        type: "image_url",
        image_url: {
          url: selectedResponse.data[0].url
        }
      }
    ]

    console.log(newContent);

    const newMessage = {
      role: "user",
      content: newContent
    }

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

  
    const apiRequestBody = {
      "model": AI_MODEL,
      "messages": [
        newMessage
      ],
    }
    
    await fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body:JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json()
      }).then((data) => {
        try {
          const assistantResponse = {
            role: 'assistant',
            content: data.choices[0].message.content
          };
          setMessages((prev) => [...prev, assistantResponse]);
          console.log("SVAR FRA GPT:", assistantResponse.content);
          setPromptFromAI(assistantResponse.content)
        }
        catch (e) {
          console.error("Error chatcompletion: ", e)
        }
      }) 
  }

  const sendPromptToAI = async (prompt: string) => {
    const newMessage = {
      model: IMAGE_MODEL,
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    }
  
    await fetch("https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json"
          },
          body:JSON.stringify(newMessage)
        }).then((data) => {
          return data.json()
        }).then((data) => {
          console.log(data)
          try {
            const response: Response = data
            console.log(response)
            setGeneratedResponses(prevResponses => [...prevResponses, response]);
        
          } catch (e) {
            console.error("Failed to parse data", e)
          }
        })
  }

  const downloadImagesAsZip = async () => {
      const imageUrls = getAllImages();
        
      window.open(`/api/archive?images=${encodeURIComponent(JSON.stringify(imageUrls))}`, "_blank")
  }

  
  function getAllImages() {
    return generatedResponses.map((response, i) => (
      {
        name: `Image-${i}`,
        url: response.data[0].url
      }
    ));
  }


  const genereateDummyResponses = (n: number) => {
    let responses: Response[] = []
    for (let index = 0; index < n; index++) {
      const element: Response = {
        created: n,
        data: [
          {
            revised_prompt: "Morn du",
            url: "/assets/arne.png"
          }
        ]
      }
      responses.push(element)
    }
    return responses
  }


  const handleGeneratePDF = async (headers: PdfHeader) => {
    let currentY = 40
    const newItem = () => {
      currentY = currentY + 30
    }

    const date = new Date().toDateString()
    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: "a4"
    })

    const marginLeft = 40;
    const marginRight = 40;
    const marginTop = 40;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const midPoint = pageWidth / 2;

    pdf.setProperties({
      title: headers.title
    })

    // Tittelen på dokumentet
    pdf.setFontSize(22);
    pdf.setFont('Helvetica', 'bold')
    pdf.text(headers.title, marginLeft, currentY);
    newItem(); 

    // Datoen
    pdf.setFontSize(12);
    pdf.setFont('Helvetica', 'normal')
    pdf.text(`Dato: ${date}`, marginLeft, currentY); // Litt under tittelen
    newItem(); 

    // Varighet
    pdf.setFontSize(12);
    pdf.text(`Varighet: ${headers.duration} t`, marginLeft, currentY); // Litt under tittelen
    newItem(); 

    // Designere til venstre
    pdf.setFontSize(16);
    pdf.text('Designere:', marginLeft, currentY); // Overskrift for designere

    let designersY = currentY
    let usersY = currentY

    pdf.setFontSize(12);
    headers.designers.forEach((designer, index) => {
      pdf.text(`- ${designer}`, marginLeft + 20, currentY + 15 + index * 20); // Plasserer designerne vertikalt med litt innrykk
      designersY += 10
      
    });

    // Brukere til høyre
    const usersStartX = midPoint + 20; // Start brukere rett etter midten
    pdf.setFontSize(16);
    pdf.text('Deltakere:', usersStartX, currentY); // Overskrift for brukere på samme høyde som designere
    
    pdf.setFontSize(12);
    headers.users.forEach((user, index) => {
    pdf.text(`- ${user}`, usersStartX + 20, currentY + 15 + index * 20); // Plasserer brukerne vertikalt på høyre side
    usersY += 10
    });

    const newY = Math.max(designersY, usersY);
    currentY = currentY + newY

    // Legg til tilleggsinformasjon
    pdf.setFontSize(16);
    pdf.text('Tilleggsinformasjon:', marginLeft, currentY);
    newItem();

    // Selve tilleggsinformasjonen, med linjeomslag hvis nødvendig
    const availableWidth = pageWidth - marginLeft - marginRight;
    const infoLines = pdf.splitTextToSize(headers.additionalInfo, availableWidth); // Del opp teksten hvis den er for lang
    pdf.setFontSize(12);
    pdf.text(infoLines, marginLeft, currentY); // Plasser tekst under overskriften for tilleggsinformasjon
    newItem();

    pdf.addPage();
    currentY = 40
    const imageWidth = 100; // Bredde på hvert bilde
    const imageHeight = 100; // Høyde på hvert bilde
    const padding = 10; // Mellomrom mellom bilder
    const imagesPerRow = Math.floor(availableWidth / (imageWidth + padding)); // Antall bilder som får plass på én rad

    // Startplassering for bilder
    pdf.setFontSize(16);
    pdf.text("Bilder fra økten:", marginLeft, currentY)
    newItem();
    let startX = marginLeft;
    let startY = currentY;

    /* if (startY + imageHeight > pageHeight - marginTop) {
      // Legger til en ny side
      pdf.addPage();
      startY = marginTop;
      startX = marginLeft;
      currentY = 40;
      }
      
      if (i % imagesPerRow === 0 && i !== 0) {
        // Flytter til neste rad
        startX = marginLeft;
        startY += imageHeight + padding;
        currentY = startY;
        }
        
        // Legger bildet til PDF
        pdf.addImage(res, "PNG", startX, startY, imageWidth, imageHeight);
        startX += imageWidth + padding; */
        /*pdf.save(`${headers.title}-${date}.pdf`)*/
        
    /* setModalOpen(false) */
  } 

  const content = (headers: PdfHeader) => {
    const date = new Date().toLocaleDateString("no-NO", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const images = getAllImages();

    return (
      <div className="flex flex-col justify-center items-center w-[90%] mx-auto space-y-4">
        <h1 className="font-bold text-2xl text-center">{headers.title}</h1>
        <h2 className="font-bold text-lg">{date}</h2>
        <h2 className="font-bold text-lg">Varighet: {headers.duration} timer</h2>
        
        <div className="w-full">
          <table className="table-auto w-full border-collapse border border-slate-400">
            <thead>
              <tr>
                <th className="border border-slate-300 py-2">Designere</th>
                <th className="border border-slate-300 py-2">Deltakere</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 px-4 py-2 align-top">
                  <ul className="list-disc">
                    {headers.designers.map((designer, i) => (
                      <li key={`designer-${i}`} className="text-gray-700 ml-2">{designer}</li>
                    ))}
                  </ul>
                </td>
                <td className="border border-slate-300 px-4 py-2 align-top">
                  <ul className="list-disc">
                    {headers.users.map((user, i) => (
                      <li key={`user-${i}`} className="text-gray-700 ml-2">{user}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
    
        <div className="flex flex-col w-full">
          <h2 className="font-bold text-lg mb-2">Notater:</h2>
          <div className="border border-slate-300">
            <p className="p-5">{headers.additionalInfo}</p>
          </div>
        </div>

       {/*  <div className="html2pdf__page-break" /> */}

        <div className="w-full grid grid-flow-row grid-cols-3 gap-4">
          {images.map((image) => (
            <div style={{width: 200, height: 200, position: 'relative'}}>
              <Image src={image.url} id={image.name} layout="fill" objectFit="contain" alt="aiBilde"/> 
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  const handlePDF2 = async (headers: PdfHeader) => {
    const html2pdf = await require('html2pdf.js');
    const options = {
      margin: [20, 0, 20, 0],
      filename: `${headers.title}`,
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      }, 
      autoPaging: 'text',
    };
    const printElement = ReactDOMServer.renderToString(content(headers))
    html2pdf().from(printElement).set(options).save()
   }


  return (
    <main className="relative min-h-screen bg-white bg-dot-blue-950/[0.4]">
      {/* SIDEBAR PERSONAS */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="ml-10 grid grid-cols-3 gap-4 p-5">

        {/* Selected response display */}
        <div className="col-span-2 min-h-[600px]">
          {selectedResponse?
            <GeneratedImages 
            selectedResponse={selectedResponse}
            currentPrompt={promptInput}
            />
            :
            <BlockQ />
          }
        </div>

        {/* User input section */}
        <div className="min-h-[400px] shadow-md rounded bg-white">
          <div className="w-full">
            <form className="px-8 pt-6 pb-8">
              <div className="mb-4 flex justify-center flex-col space-y-2">
                {generatedResponses.length === 0? 
                <>
                  <label>
                    <h2 className="font-bold text-2xl">Legg ved scenario:</h2>
                  </label>
                  <ExpandableTextarea prompt={scenario} setPrompt={setScenario}/>
                </> 
                  : 
                <>
                  <label className="block text-gray-700 text-sm font-bold mb-2" >
                    <h2 className="font-bold text-2xl">Endre bildet:</h2>
                  </label>
                  <ExpandableTextarea prompt={currentPrompt} setPrompt={setCurrentPrompt}/>
                </>
                }
                <label className="block text-gray-700 text-sm font-bold mb-2" >
                  <h2 className="font-bold text-lg">Antall bilder (1-4):</h2>
                </label>
                <input 
                value={numImages}
                type="number"
                id="numImages"
                className="w-full border rounded-md p-2"
                min={1}
                max={4}
                onChange={e => setNumImages(e.target.valueAsNumber)}
                />

                {generatedResponses.length === 0? 
                <GenerateButton text="Opprett forslag basert på scenario" onClick={handleGenerateScenario} icon={<PersonaIcon />}/>
                :
                <>
                {loading? <LoadingButton text="Genererer bilder ..."/> : <GenerateButton text="Generer" onClick={handleNewImagePrompt} icon={<ImagesIcon />}/>}
                </>
                }
                {generatedResponses.length > 0 &&
                <>
                <GenerateButton text="Last ned genererte bilder"
                onClick={() => downloadImagesAsZip()} disabled={generatedResponses.length === 0} icon={<ZIPIcon />}/>  
                </>
                }
                <GenerateButton text="Eksporter PDF" onClick={() => setModalOpen(true)} icon={<PDFIcon />}/>
                <GenerateButton text="Fjern lagrede bilder" 
                onClick={() => removeLocalStorage("generatedImages")} icon={<TrashIcon />}/>
                <Link href={"/maskin"} className="py-2.5 px-5 me-2 text-sm w-full font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 hover:cursor-pointer focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center hover:disabled:cursor-not-allowed hover:disabled:bg-none">BETA: masking</Link>
              </div>
            </form>
          </div>
          {modalOpen && 
          <QuestionModal setModal={setModalOpen} exportPdf={handlePDF2}/>
          }
        </div>

        <Separator className="col-span-3 bg-blue-200"/>

        {/* Genererte bilder */}
        <div className="col-span-3">
          <div>
            {loading && generatedResponses.length < 1? 
              <LinearLoading />
              : 
              <ImageCarousel responses={generatedResponses} setSelectedResponse={setSelectedResponse} selected={selectedResponse}/> 
            }
          </div>
        </div>
      </div>
    </main>
  );
}


const LinearLoading = () => {
  return (
    <div className='w-full'>
      <div className='h-1.5 w-full bg-blue-100 overflow-hidden rounded-lg'>
        <div className='animate-progress w-full h-full bg-blue-500 origin-left-right' />
      </div>
    </div>
  )
}

const PDFIcon = () => {
  return (
      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z"/>
    </svg>
  )
}

const ZIPIcon = () => {
  return (
    <svg className="w-3.5 h-3.5 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
  </svg>
  )
}

const ImagesIcon = () => {
  return (
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"   xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
    </svg>
  )
}

const PersonaIcon = () => {
  return (
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm10 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-8-5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.942 4a3 3 0 0 0-2.847 2.051l-.044.133-.004.012c-.042.126-.055.167-.042.195.006.013.02.023.038.039.032.025.08.064.146.155A1 1 0 0 0 6 17h6a1 1 0 0 0 .811-.415.713.713 0 0 1 .146-.155c.019-.016.031-.026.038-.04.014-.027 0-.068-.042-.194l-.004-.012-.044-.133A3 3 0 0 0 10.059 14H7.942Z" clipRule="evenodd"/>
    </svg>
  )
}

const TrashIcon = () => {
  return (
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
    </svg>

  )
}





