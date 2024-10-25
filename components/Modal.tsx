"use client";
import { useState } from "react";
import { GenerateButton } from "./Buttons";
import { ExportPdf } from "./ExportPdf";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter
} from "./ui/animated-modal";

const buttonStyle = "py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 hover:cursor-pointer focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center hover:disabled:cursor-not-allowed hover:disabled:bg-none"

interface ChildProps {
    setModal: (value: boolean) => void,
    exportPdf: (value: PdfHeader) => void
}

export const QuestionModal: React.FC<ChildProps> = ({setModal, exportPdf}) => {
    const [pdfInfo, setPdfInfo] = useState<PdfHeader | undefined>(undefined)

    const handleExport = () => {
        if (!pdfInfo) {
            alert("Husk å lagre informasjonen")
            return
        }
        exportPdf(pdfInfo)
    }
    return (
        <div className="flex items-center justify-center flex-col w-full">
        <Modal setModal={setModal}>
            <ModalBody>
                <ModalContent>
                    <h1 className="text-center font-extrabold text-2xl">PDF INFO</h1>
                    <ExportPdf setPdfHeaders={setPdfInfo}/>
                </ModalContent>
                <ModalFooter className="gap-4">
                    <div className="flex flex-row justify-end items-center">
                        <GenerateButton text="Eksporter PDF" onClick={handleExport} icon={<PDFIcon/>} style={buttonStyle}/>
                    </div>
                </ModalFooter>
            </ModalBody>
        </Modal>
        </div>
    );
}

const PDFIcon = () => {
    return (
        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z"/>
      </svg>
    )
}