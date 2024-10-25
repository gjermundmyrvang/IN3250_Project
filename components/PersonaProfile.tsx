import { Response } from "@/app/page";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { GenerateButton, LoadingButton } from "./Buttons";
import { AlertMessage } from "./ErrorMsg";
import ExpandableTextarea from "./ExpandableTextArea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY

// Original personaData
const initialPersona: Persona = {
  name: "Arne Brimi",
  age: 76,
  lives_in: "Sagene, Oslo",
  background: {
    occupation: "Tidligere kokk",
    current_status: "Pensjonist",
    reason_for_retirement: "Begynte å få skjelvinger i hendene som gjorde det vanskelig å fortsette i yrket",
    living_situation: "Bor alene på Storo i Oslo",
    hobbies: ["Gå turer utendørs", "Se på kokkeprogrammer på TV", "Lage enkle måltider hjemme"],
    technology_usage: "Ser på TV på ettermiddagene, bruker mobiltelefon til enkel kommunikasjon, føler seg usikker på moderne teknologi"
  },
  goals: ["Holde seg aktiv både fysisk og mentalt", "Føle seg oppdatert til tross for utfordringer med teknologi", "Opprettholde en enkel, men meningsfull sosial kontakt med venner og familie"],
  frustrations: ["Føler at teknologi utvikler seg raskt og vanskelig å henge med", "Opplever at det kommer nye apparater, apper og tjenester hele tiden som han ikke forstår seg på", "Skjelvinger i hendene gjør det utfordrende å bruke små elektroniske enheter, som mobiltelefoner og fjernkontroller"],
  motivations: ["Lidenskap for matlaging og interesse for kokkeprogrammer", "Ønsker å holde seg selvstendig og uavhengig i hverdagen", "Fortsatt glede av å være utendørs og i naturen"],
  technology_comfort_level: {
    devices: [
      { name: "Mobiltelefon", usage: "Brukes hovedsakelig til enkel kommunikasjon med familie og venner, men han sliter med nye funksjoner og apper" },
      { name: "TV", usage: "Foretrekker tradisjonell TV over strømmetjenester fordi det er mer kjent og enkelt" }
    ],
    feelings_about_technology: "Føler seg ofte overveldet av teknologisk utvikling, og opplever at alt blir mer komplisert enn før"
  },
  health: {
    physical_conditions: [{ name: "Skjelvinger i hendene", impact: "Gjør det vanskelig å utføre finmotoriske oppgaver, som å betjene elektronikk og lage kompliserte matretter" }],
    mental_health: { status: "Føler seg av og til isolert på grunn av mangel på kontakt med det moderne samfunnets teknologiske fremskritt" }
  },
  social_life: {
    family: "Har sporadisk kontakt med nær familie, men de bor langt unna",
    friends: "Har noen få nære venner som han ser fra tid til annen",
    social_challenges: "Savner den daglige kontakten han hadde gjennom arbeidslivet, og føler seg av og til glemt"
  }
};

const initialPrompt = `Lag et Persona-objekt basert på informasjonen nedenfor. Svar i JSON-lignende format som samsvarer med denne TypeScript-definisjonen:

type Persona = {
  name: string;
  age: number;
  background: {
    occupation: string;
    current_status: string;
    reason_for_retirement: string;
    living_situation: string;
    hobbies: string[];
    technology_usage: string;
  };
  goals: string[];
  frustrations: string[];
  motivations: string[];
  technology_comfort_level: {
    devices: {
      name: string;
      usage: string;
    }[];
    feelings_about_technology: string;
  };
  health: {
    physical_conditions: {
      name: string;
      impact: string;
    }[];
    mental_health: {
      status: string;
    };
  };
  social_life: {
    family: string;
    friends: string;
    social_challenges: string;
  };
};


NB! Returner kun det JSON-lignende svaret og skriv verdiene på norsk. Fyll inn passende informasjon der det eventuelt mangler. 

Her er informasjonen som skal brukes for å fylle ut Persona-objektet:`

interface Message {
  role: string,
  content: string
}

const ArneBrimiProfile: React.FC = () => {
  const [personaData, setPersonaData] = useState<Persona | undefined>(undefined)
  const [image, setImage] = useState<string | undefined>(undefined)
  
  return (      
    <div className="max-w-4xl mx-auto bg-slate-200 shadow-2xl rounded-tr-lg rounded-br-lg p-5 pr-20 min-h-screen">
      {personaData? 
        <PersonaComponent personaData={personaData} image={image}/>
        :
        <div className="flex flex-col">
          <CreatePersona setPersona={setPersonaData} setImage={setImage}/>
          <GenerateButton text="Bruk eksempelpersonas" 
          onClick={() => {
            setPersonaData(initialPersona);
            setImage("/assets/arne.jpg")
            }} />
        </div>
      }
    </div>
    
  );
};

const PersonaComponent = ({personaData, image}:{personaData: Persona, image?: string}) => {
  return (
    <div>
      <div className="grid grid-cols-2 w-full gap-x-5">
          <div className="col-span-1">
            {image? 
            <Image 
            src={image} 
            width={200} 
            height={200} 
            alt="PersonaImage" 
            layout="responsive" 
            className="rounded-md shadow-md"
            />
            :
            <div className="w-[200px] h-[200px] rounded shadow" />
            }
          </div>
          <div className="col-span-1">
              <h1 className="text-3xl font-semibold mb-2">{personaData.name}, {personaData.age} år</h1>
              <p className="text-gray-700 mb-4">Bor på </p>
              <p className="text-lg text-gray-600 mb-6"><strong>Yrke:</strong> {personaData.background.occupation}, {personaData.background.current_status}</p>

              <h2 className="text-xl font-semibold mb-1">Bakgrunn</h2>
              <p className="text-gray-600"><strong>Pensjonert på grunn av:</strong> {personaData.background.reason_for_retirement}</p>
              <p className="text-gray-600"><strong>Hobbyer:</strong> {personaData.background.hobbies?.join(", ")}</p>
              <p className="text-gray-600"><strong>Teknologi-bruk:</strong> {personaData.background.technology_usage}</p>
          </div>
      </div>
      <div className="flex items-start space-x-6 mt-10">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Mål</h2>
              <ul className="list-disc list-inside text-gray-600">
                {personaData.goals?.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Frustrasjoner</h2>
              <ul className="list-disc list-inside text-gray-600">
                {personaData.frustrations?.map((frustration, index) => (
                  <li key={index}>{frustration}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Motivasjoner</h2>
              <ul className="list-disc list-inside text-gray-600">
                {personaData.motivations?.map((motivation, index) => (
                  <li key={index}>{motivation}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Helse</h2>
              <p className="text-gray-600"><strong>Fysiske utfordringer:</strong> {personaData.health?.physical_conditions?.map(condition => condition.name).join(", ")}</p>
              <p className="text-gray-600"><strong>Psykisk helse:</strong> {personaData.health?.mental_health?.status}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Sosialt Liv</h2>
              <p className="text-gray-600"><strong>Familie:</strong> {personaData.social_life?.family}</p>
              <p className="text-gray-600"><strong>Venner:</strong> {personaData.social_life?.friends}</p>
              <p className="text-gray-600"><strong>Utfordringer:</strong> {personaData.social_life?.social_challenges}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Teknologisk Nivå</h2>
              <ul className="list-disc list-inside text-gray-600">
                {personaData?.technology_comfort_level?.devices?.map((device, index) => (
                  <>
                  <p className="text-gray-600" key={index}><strong>{device.name}: </strong>{device.usage}</p>
                  </>
                ))}
              </ul>
            </div>
          </div>
      </div>
    </div>
  );
}

const CreatePersona = ({setPersona, setImage}:{setPersona: (value: Persona) => void, setImage: (value: string) => void}) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [age, setAge] = useState<number | undefined>(undefined);
    const [location, setLocation] = useState('');
    const [extraInfo, setExtraInfo] = useState("");
    const [showError, setShowError] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [personaProfile, setPersonaProfile] = useState<Persona | undefined>(undefined)
  
    const handleGenerate = async () => {
      if (!inputOk()) {
        setShowError(true);
        return
      }
      await handleGeneratePersonas();
      
      if (personaProfile) {
        const profile = `Naturlig, hvit bakgrunn, profesjonelt, portrett av denne personen: ${personaProfile}`
        await sendPromptToDALLe(profile);
      }
  };

  const generatePrompt = () => {
    let initial = initialPrompt
    const addedInfo = 
    `Fornavn: ${firstname}, Etternavn: ${lastname}, Alder: ${age}, Bosted: ${location}, Her kommer ekstra informasjon som du skal inkludere: ${extraInfo} 
    `
    const prompt = initial + "\n" + addedInfo
    return prompt
  }

  const inputOk = () => {
    if (firstname === "" || lastname === "" || age === undefined || location === "") {
      setShowError(true)
      return false
    }
    setShowError(false)
    return true
  }

  const handleGeneratePersonas = async () => {
    setLoading(true) 
    
    const personaPrompt = generatePrompt();
    const newMessage = {
      role: "user",
      content: personaPrompt
    }
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    
    const apiRequestBody = {
      "model": "gpt-4o",
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
          const assistantResponse: Message = {
            role: 'assistant',
            content: data.choices[0].message.content
          };
          setMessages((prev) => [...prev, assistantResponse]);
          const cleanResponse = assistantResponse.content.replace(/```json|```/g, '').trim();
          const jsonResponse = JSON.parse(cleanResponse);
          console.log(jsonResponse);
          setPersonaProfile(jsonResponse)
          setPersona(jsonResponse);
        }
        catch (e) {
          console.error("Error chatcompletion: ", e)
        }
      }) 
      setLoading(false)
  }

  const sendPromptToDALLe = async (profile:string) => {
    const prompt = profile
    const newMessage = {
      model: "dall-e-3",
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
           
            setImage(response.data[0].url)
        
          } catch (e) {
            console.error("Failed to parse data", e)
          }
        })
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-y-5">
      <h1 className="font-bold text-2xl text-start">Opprett nytt personas:</h1>
      <ul className="list-disc list-inside text-gray-600">
        <li>Fyll ut nødvendig informasjon</li>
        <li>Fyll deretter inn så mye ekstra informasjon du ønsker</li>
        <li>Samlet informasjon blir grunnlaget for generert personas</li>
        <li>Trykk 'Opprett Personas' når du er fornøyd</li>
      </ul>
      <form className="my-8 w-full">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer className="flex-1">
            <Label htmlFor="firstname">Fornavn</Label>
            <Input 
              id="firstname" 
              placeholder="Arne" 
              type="text" 
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)} 
              className="w-full"
            />
          </LabelInputContainer>
          <LabelInputContainer className="flex-1">
            <Label htmlFor="lastname">Etternavn</Label>
            <Input 
              id="lastname" 
              placeholder="Brimi" 
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full"
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="age">Alder</Label>
          <Input 
            id="age" 
            placeholder="75" 
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.valueAsNumber)} 
            className="w-full"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="place">Bosted</Label>
          <Input 
            id="place" 
            placeholder="Sagene" 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="place">All ekstra informasjon sentralt for personas</Label>
          <ExpandableTextarea prompt={extraInfo} setPrompt={setExtraInfo} />
        </LabelInputContainer>


        {loading? <LoadingButton text="Oppretter personas ..."/> : <GenerateButton text="Generer persona" onClick={handleGenerate} />}
        

        {showError && 
          <AlertMessage message="Vennligst fyll ut alle feltene" onClose={() => setShowError(false)} />
        }
      </form>

    </div>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default ArneBrimiProfile;

/* 
 const ArneBrimiProfile: React.FC = () => {
    return (
      <div className="max-w-4xl mx-auto bg-slate-200 shadow-2xl rounded-tr-lg rounded-br-lg p-5 pr-20 min-h-screen">
        <div className="grid grid-cols-2 w-full gap-x-5">
            <div className="col-span-1">
                <Image 
                src={"/assets/arne.jpg"} 
                width={200} 
                height={200} 
                alt="Arne" 
                layout="responsive" 
                className="rounded-md shadow-md"
                />
            </div>
            <div className="col-span-1">
                <h1 className="text-3xl font-semibold mb-2">{personaData.name}, {personaData.age} år</h1>
                <p className="text-gray-700 mb-4">Bor på Storo, Oslo</p>
                <p className="text-lg text-gray-600 mb-6"><strong>Yrke:</strong> {personaData.background.occupation}, {personaData.background.current_status}</p>

                <h2 className="text-xl font-semibold mb-1">Bakgrunn</h2>
                <p className="text-gray-600"><strong>Pensjonert på grunn av:</strong> {personaData.background.reason_for_retirement}</p>
                <p className="text-gray-600"><strong>Hobbyer:</strong> {personaData.background.hobbies.join(", ")}</p>
                <p className="text-gray-600"><strong>Teknologi-bruk:</strong> {personaData.background.technology_usage}</p>
            </div>
        </div>
        <div className="flex items-start space-x-6 mt-10">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Mål</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {personaData.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Frustrasjoner</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {personaData.frustrations.map((frustration, index) => (
                    <li key={index}>{frustration}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Motivasjoner</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {personaData.motivations.map((motivation, index) => (
                    <li key={index}>{motivation}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Helse</h2>
                <p className="text-gray-600"><strong>Fysiske utfordringer:</strong> {personaData.health.physical_conditions.map(condition => condition.name).join(", ")}</p>
                <p className="text-gray-600"><strong>Psykisk helse:</strong> {personaData.health.mental_health.status}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Sosialt Liv</h2>
                <p className="text-gray-600"><strong>Familie:</strong> {personaData.social_life.family}</p>
                <p className="text-gray-600"><strong>Venner:</strong> {personaData.social_life.friends}</p>
                <p className="text-gray-600"><strong>Utfordringer:</strong> {personaData.social_life.social_challenges}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Teknologisk Nivå</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {personaData.technology_comfort_level.devices.map((device, index) => (
                    <>
                    <p className="text-gray-600" key={index}><strong>{device.name}: </strong>{device.usage}</p>
                    </>
                  ))}
                </ul>
                
              </div>
            </div>
        </div>
      </div>
    );
  };
  
  export default ArneBrimiProfile;
*/