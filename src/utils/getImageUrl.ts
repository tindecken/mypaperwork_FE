const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Converts a base64 encoded image string to a URL that can be used as a source for an image element.
 *
 * @param {string} imageBase64 - The base64 encoded image string.
 * @returns {string} - The URL representing the image.
 */
export const getImageUrl = (imageBase64: string): string => {
  const arrayBuffer = base64ToArrayBuffer(imageBase64);
  const coverUnit8Array = new Uint8Array(Object.values(arrayBuffer));
  const blob = new Blob([coverUnit8Array], { type: 'image/jpeg' });
  const urlCreator = window.URL || window.webkitURL;
  const imageUrl = urlCreator.createObjectURL(blob);
  return imageUrl;
};
