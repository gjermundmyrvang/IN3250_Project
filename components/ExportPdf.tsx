import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { GenerateButton } from './Buttons';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ChildProps {
    setPdfHeaders: (value: PdfHeader) => void
}

export const ExportPdf: React.FC<ChildProps> = ({setPdfHeaders}) => {
    const [members, setMembers] = useState<string[]>([""])
    const [users, setUsers] = useState<string[]>([""])
    const [title, setTitle] = useState("")
    const [duration, setDuration] = useState<number | undefined>(undefined)
    const [additionalInfo, setAdditionalInfo] = useState("")

    const handleExportHeader = () => {
        const header: PdfHeader = {
            title: title,
            designers: members,
            users: users,
            duration: duration,
            additionalInfo: additionalInfo
        }
        setPdfHeaders(header)
        alert("Lagring vellykket")
    }

    
    const addMemberField = () => {
        setMembers([...members, ""]) 
      }
    
    const handleMemberChange = (index: number, value: string) => {
        const updatedMembers = [...members]
        updatedMembers[index] = value
        setMembers(updatedMembers)
    }

    const handleMemberRemoved = (index:number) => {
        const updatedMembers = members.filter((_, i) => i !== index);
        setMembers(updatedMembers);
    }

    const addUserField = () => {
        setUsers([...users, ""]) 
      }
    
    const handleUserChange = (index: number, value: string) => {
        const updatedUsers = [...users]
        updatedUsers[index] = value
        setUsers(updatedUsers)
    }

    const handleUserRemoved = (index:number) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
    }

    const labelStyle = "font-bold text-lg"

  return (
    <div>
    <form className="my-8 w-full">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="age" className={labelStyle}>Tittel</Label>
          <Input 
            id="title" 
            placeholder="Workshop Sagene Seniorsenter" 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full"
          />
        </LabelInputContainer>
        <LabelInputContainer>
            <Label htmlFor='additional' className={labelStyle}>Varighet</Label>
            <Input 
            id='duration'
            type='number'
            placeholder='varighet'
            value={duration}
            onChange={(e) => setDuration(e.target.valueAsNumber)}
            />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <div className='grid grid-cols-2'>
            <div className='col-span-1'>
                <Label htmlFor="place" className={labelStyle}>Designere:</Label>
                {members.map((member, index) => (
                <div key={index} className='flex flex-row items-center space-x-2'>
                    <Input 
                    id="members" 
                    type="text"
                    placeholder='John Apple' 
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    className="flex-grow w-full"
                    />
                    <div onClick={() => handleMemberRemoved(index)} className='p-2 rounded-full border hover:cursor-pointer bg-gray-50'>
                        <RemoveUserIcon />
                    </div>
                </div>            
                ))}
                <div onClick={() => addMemberField()} className=' hover:cursor-pointer'>
                    <RemoveUserIcon add='add'/>
                </div>
            </div>
            <div>
            <Label htmlFor="place" className={labelStyle}>Deltakere:</Label>
            {users.map((user, index) => (
                <div key={index} className='flex flex-row w-full items-center space-x-2'>
                    <Input 
                    id="members" 
                    type="text"
                    placeholder='Arne Appbrimile' 
                    value={user}
                    onChange={(e) => handleUserChange(index, e.target.value)}
                    className="min-w-full"
                    />
                    <div onClick={() => handleUserRemoved(index)} className='flex p-2 rounded-full border hover:cursor-pointer bg-gray-50'>
                        <RemoveUserIcon />
                    </div>
                </div>            
                ))}
                <div onClick={() => addUserField()} className=' hover:cursor-pointer'>
                    <RemoveUserIcon add='add'/>
                </div>
            </div>
          </div>
        </LabelInputContainer>
        <LabelInputContainer>
            <Label htmlFor='additional' className={labelStyle}>Notater fra gjennomgang</Label>
            <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className='p-2 rounded border border-2-gray-50' placeholder='ekstra info' />
        </LabelInputContainer>
        <GenerateButton text='Lagre info' onClick={handleExportHeader} style='mt-5'/>
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

const RemoveUserIcon = ({add}:{add?:string}) => {
    if (add) {
        return (
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
            </svg>
        )
    }
    return (
        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M5 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm-2 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1Zm13-6a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Z" clip-rule="evenodd"/>
        </svg>
    )
}
