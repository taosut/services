export interface ISignedUrlResponse {
  ContentType: string;
  filePath: string;
  filename: string;
  url: string;
}

export interface IFile {
  buffer: Buffer;
  encoding: string;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface IAWSResponse {
  ETag: Buffer;
  Location: string;
  key: string;
  Bucket: string;
}

export interface IFileResponse {
  fileType: string;
  path: string;
  size: number;
}
