export const getImgUrl = (imageData) => {
    if (!imageData) return '';
  
    // If already starts with 'data:image', it's valid
    if (imageData.startsWith('data:image')) {
      return imageData;
    }
  
    // Otherwise, wrap it as base64 (assuming JPEG by default, you can change if needed)
    return `data:image/jpeg;base64,${imageData}`;
  };
  