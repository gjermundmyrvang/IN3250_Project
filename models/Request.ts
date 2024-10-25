export type ImageRequest = {
    "model": "dall-e-3",
    "prompt": string,
    "n": number,
    "size": "1024x1024"
  }

export type ImageResponse = {
    "created": number,
    "data": [
      {
        "revised_prompt": string,
        "url": string
      }
    ]
  }