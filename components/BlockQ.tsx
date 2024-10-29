import { Boxes } from "./ui/background-boxes"

export const BlockQ = () => {
  return (
    <div className="flex w-full relative items-center justify-center h-full rounded-md bg-blue-900" id="blockQ">
        <div className="h-full absolute w-full overflow-hidden [mask-image:radial-gradient(transparent,white)]">
            <Boxes />
        </div>
        <figure className="max-w-screen-md mx-auto text-center p-5">
            <svg className="w-10 h-10 mx-auto mb-3 text-white dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
            </svg>
            <blockquote>
                <p className="text-3xl italic font-medium text-white  dark:text-white">"To invent, you need a good imagination and a pile of junk."</p>
            </blockquote>
            <figcaption className="flex items-center justify-center mt-6 space-x-3 rtl:space-x-reverse">
                <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-orange-500 dark:divide-gray-700">
                    <cite className="pe-3 font-medium text-white  dark:text-white text-lg">Thomas Edison</cite>
                    <cite className="ps-3 text-lg text-orange-500 dark:text-white ">Inventor</cite>
                </div>
            </figcaption>
        </figure>
    </div>
  )
}
