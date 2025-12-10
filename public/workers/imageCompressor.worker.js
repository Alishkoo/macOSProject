

self.addEventListener('message', async (e) => {
  const { file, maxWidth, maxHeight, quality } = e.data;

  try {

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

  
    const imageBitmap = await createImageBitmap(blob);

 
    let width = imageBitmap.width;
    let height = imageBitmap.height;

    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height;
      if (width > height) {
        width = maxWidth;
        height = width / aspectRatio;
      } else {
        height = maxHeight;
        width = height * aspectRatio;
      }
    }

    
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');

   
    ctx.drawImage(imageBitmap, 0, 0, width, height);

 
    const compressedBlob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: quality || 0.8,
    });


    self.postMessage({
      success: true,
      blob: compressedBlob,
      originalSize: file.size,
      compressedSize: compressedBlob.size,
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message,
    });
  }
});
