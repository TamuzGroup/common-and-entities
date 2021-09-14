const GOOGLE_FOLDER_PATH = "application/vnd.google-apps.folder";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
];
const REDIRECT_AFTER_CLOUD_AUTH = "http://localhost:3000/Upload";

const constants = {
  GOOGLE_FOLDER_PATH,
  GOOGLE_SCOPES,
  REDIRECT_AFTER_CLOUD_AUTH,
};

export default constants;
