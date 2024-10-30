export const getCroppedImg = async (
    imageSrc: string,
    crop: { x: number; y: number; width: number; height: number },
    rotation: number = 0
  ): Promise<string> => {
    const createImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = reject;
      });
  
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    if (!ctx) return '';
  
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const { width, height } = crop;
    
    canvas.width = width;
    canvas.height = height;
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      width,
      height
    );
  
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const fileUrl = URL.createObjectURL(blob);
          resolve(fileUrl); // This is a URL that you can use to display or upload the image
        }
      }, 'image/jpeg');
    });
  };
  