export interface IClouds {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  refreshToken: string;
  cloudAuth(): object;
  createFolder(folderName: string, parentId: string): Promise<Response>;
  searchFolder(folderName: string): Promise<Response>;
  saveFile(
    fileName: string,
    filePath: string,
    fileMimeType: string,
    folderId: string
  ): Promise<Response>;
  getDriveFiles(folderId: string): Promise<Response>;
  getAuthToken: (code: string) => void;
  deleteFile(fileId: string): Promise<Response>;
  downloadFile(fileId: string, fileName: string): Promise<Response>;
  getFileData(fileId: string): Promise<Response>;
  shareFile(
    fileId: string,
    email: string,
    role: string,
    type: string
  ): Promise<Response>;
  generateAuthUrl(): Promise<Response> | string;
}
