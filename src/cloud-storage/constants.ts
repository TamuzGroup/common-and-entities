const GOOGLE_FOLDER_PATH = "application/vnd.google-apps.folder";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
];
const REDIRECT_AFTER_CLOUD_AUTH = "http://localhost:3000/Upload";
const ONE_DRIVE_GET_TOKEN_URL = "https://login.live.com/oauth20_token.srf";
const ONE_DRIVE_AUTHORIZE_URL = "https://login.live.com/oauth20_authorize.srf";

const constants = {
  GOOGLE_FOLDER_PATH,
  GOOGLE_SCOPES,
  REDIRECT_AFTER_CLOUD_AUTH,
  ONE_DRIVE_GET_TOKEN_URL,
  ONE_DRIVE_AUTHORIZE_URL,
};

export default constants;
