import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check } from 'lucide-react';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({ imageUrl, aspect, onCropDone, onCancel }) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const handleCropDone = () => {
    if (completedCrop && imgRef.current) {
      const canvas = document.createElement('canvas');
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height,
      );

      canvas.toBlob((blob) => {
        if (blob) {
          // Convert blob to File object
          const file = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });
          onCropDone(file, URL.createObjectURL(blob));
        }
      }, 'image/jpeg');
    } else {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/95 p-4 pb-8 md:pb-4">
      <div className="flex justify-between items-center mb-4 text-white">
        <h3 className="font-bold">Crop Image</h3>
        <button onClick={onCancel} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center overflow-auto overscroll-contain">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Crop me"
            onLoad={onImageLoad}
            style={{ maxHeight: '60vh', maxWidth: '100%' }}
          />
        </ReactCrop>
      </div>
      
      <div className="flex justify-center mt-auto pb-10">
        <button
          onClick={handleCropDone}
          className="flex items-center gap-2 bg-[#FFC300] text-[#1A1B22] px-8 py-3.5 rounded-xl font-bold hover:bg-[#FFC300]/90 w-full sm:w-auto justify-center shadow-lg"
        >
          <Check size={20} />
          Confirm Crop
        </button>
      </div>
    </div>
  );
}
