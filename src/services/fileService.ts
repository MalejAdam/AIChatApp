import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
export type FileType = 'image' | 'document' | 'pdf' | 'other';

export interface FileInfo {
    uri: string;
    type: FileType;
    name: string;
    size?: number;
    mimeType?: string;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class FileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FileError';
    }
}

export const pickImage = async (): Promise<FileInfo | null> => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (result.canceled) {
            return null;
        }

        const asset = result.assets[0];

        return {
            uri: asset.uri,
            type: 'image',
            name: asset.uri.split('/').pop() || 'image.jpg',
            size: asset.fileSize,
            mimeType: 'image/jpeg'
        };
    } catch (error) {
        console.error('Error picking image:', error);
        throw new FileError('Error picking image');
    }
};

export const pickDocument = async (): Promise<FileInfo | null> => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'application/msword'],
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            return null;
        }

        const asset = result.assets[0];
        let type: FileType = 'document';

        if (asset.mimeType?.includes('pdf')) {
            type = 'pdf';
        }

        return {
            uri: asset.uri,
            type,
            name: asset.name,
            size: asset.size,
            mimeType: asset.mimeType
        };
    } catch (error) {
        console.error('Error picking document:', error);
        throw new FileError('Error picking document');
    }
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFile = (file: FileInfo): void => {
    if (file.size && file.size > MAX_FILE_SIZE) {
        throw new FileError(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`);
    }
};
