import JSZip from "jszip";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const images = JSON.parse(searchParams.get('images') || '');

    interface ImageDownload {
        name: string;
        url: string;
    }

    const downloads = await Promise.all(images.map(async (image: ImageDownload) => {
        const response = await fetch(image.url);
        const contentType = response.headers.get('Content-Type')
        console.log(contentType)
        const data = await response.arrayBuffer();
        return {
          ...image,
          data,
          type: "png"
        }
      }))
    

    const zip = new JSZip();
    
    downloads.forEach((download) => {
        zip.file(`${download.name}.${download.type}`, download.data);
      })

    const generatedImages = await zip.generateAsync({type: "blob"})
    return new Response(generatedImages, {
        status: 200,
        headers: {
            'Content-Type': 'application/zip'
        }
    })
}