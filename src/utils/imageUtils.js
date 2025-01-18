// src/utils/imageUtils.js

/**
 * Gets the full URL for an image path with proper error handling and fallbacks
 * @param {string} imagePath - The relative path to the image
 * @returns {string} The complete URL to the image
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://placehold.co/800@3x.png';
    }

    try {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://spotlybackend.onrender.com'
            : 'http://localhost:5000';

        const normalizedPath = imagePath.startsWith('/uploads') 
            ? imagePath 
            : `/uploads/${imagePath}`;

        return `${baseUrl}${normalizedPath}`.replace(/([^:])\/\//g, '$1/');
    } catch (error) {
        console.error('Error constructing image URL:', error);
        return 'https://placehold.co/800@3x.png';
    }
};


/**
 * Validates if a file is an image based on its MIME type
 * @param {File} file - The file to check
 * @returns {boolean} Whether the file is a valid image
 */
export const isValidImage = (file) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return file && validImageTypes.includes(file.type);
};

/**
 * Gets a file size in a human-readable format
 * @param {number} bytes - The size in bytes
 * @returns {string} Formatted size string (e.g., "1.5 MB")
 */
export const getReadableFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};