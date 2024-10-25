"use client"
import { useState } from 'react';
import { GenerateButton } from './Buttons';

export default function Masking() {

  const [originalImage, setOriginalImage] = useState<string>('');

  const fileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width !== img.height) {
        const minVal = Math.min(img.width, img.height);
        setup(img, 0, 0, minVal, minVal);
      } else {
        setup(img, 0, 0, img.width, img.height);
      }
    };
  };

  const setup = (img: HTMLImageElement, x: number, y: number, width: number, height: number) => {
    const node = document.getElementById('PictureLayer');
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }

    const can = document.createElement('canvas');
    can.id = 'PictureLayer';
    can.width = window.innerWidth * 0.45;
    can.height = window.innerWidth * 0.45;
    can.style.margin = 'auto';

    const outerCanvas = document.getElementById('outer-canvas');
    outerCanvas?.appendChild(can);

    const ctx = can.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, x, y, width, height, 0, 0, can.width, can.height);
    ctx.lineCap = 'round';
    ctx.lineWidth = 35;
    ctx.globalCompositeOperation = 'destination-out';

    let isDrawing = false;

    const startDrawing = (event: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const pos = getPos(event);
      console.log('start erasing', pos);
      points.setStart(pos.x, pos.y);
    };

    const stopDrawing = () => {
      console.log('stop erasing');
      isDrawing = false;
    };

    const draw = (event: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const pos = getPos(event);
      points.newPoint(pos.x, pos.y);
    };

    const points = (() => {
      let queue: [number, number][] = [];
      let qi = 0;

      function clear() {
        queue = [];
        qi = 0;
      }

      function setStart(x: number, y: number) {
        clear();
        newPoint(x, y);
      }

      function newPoint(x: number, y: number) {
        queue.push([x, y]);
      }

      function tick() {
        let k = 20; // adjust to limit points drawn per cycle
        if (queue.length - qi > 1 && ctx != null) {
          ctx.beginPath();
          if (qi === 0) {
            ctx.moveTo(queue[0][0], queue[0][1]);
          } else {
            ctx.moveTo(queue[qi - 1][0], queue[qi - 1][1]);
          }

          for (++qi; --k >= 0 && qi < queue.length; ++qi) {
            ctx.lineTo(queue[qi][0], queue[qi][1]);
          }
          ctx.stroke();
        }
      }

      setInterval(tick, 50); // adjust cycle time

      return {
        setStart,
        newPoint,
      };
    })();

    window.addEventListener('mousedown', startDrawing);
    window.addEventListener('mouseup', stopDrawing);
    can.addEventListener('mousemove', draw);

    function getPos(e: MouseEvent | TouchEvent) {
      const rect = can.getBoundingClientRect();
      if ('touches' in e) {
        return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    setOriginalImage(can.toDataURL());
  };

  const downloadOriginal = () => {
    console.log('download original');
    const node = document.getElementById('PictureLayer') as HTMLCanvasElement | null;
    if (!node) return;

    const link = document.createElement('a');
    link.download = 'original.png';
    link.href = originalImage;
    link.click();
  };

  const downloadMask = () => {
    console.log('download mask');
    const node = document.getElementById('PictureLayer') as HTMLCanvasElement | null;
    if (!node) return;

    const link = document.createElement('a');
    link.download = 'mask.png';
    link.href = node.toDataURL();
    link.click();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Maskering for DALLE-2</h2>
      <input type="file" accept="image/*" onChange={fileSelected} />
      <div>
        <p style={styles.title}>Bruk musen til å tegne maske</p>
        <div style={styles.outerCanvas} id="outer-canvas" />
      </div>
      <div className="w-[50%] flex justify-center items-center mx-auto">
        <div className='m-5'>
          <GenerateButton text='Last ned original' onClick={downloadOriginal} />
        </div>
        <div className='m-5'>
            <GenerateButton text='Last ned med maske' onClick={downloadMask} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '20px',
  },
  separator: {
    margin: '8px 0',
    borderBottom: '1px solid #737373',
  },
  title: {
    margin: '8px 0',
  },
  outerCanvas: {
    width: `${window.innerWidth * 0.45}px`,
    height: `${window.innerWidth * 0.45}px`,
    border: '1px solid black',
    margin: 'auto',
  },
  buttonContainer: {
    margin: '8px 0',
  },
};