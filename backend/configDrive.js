const { google } = require('googleapis')

const CLIENT_ID = '13111503516-1nurri3m4unpfaqs6541625lm299ull7.apps.googleusercontent.com'
const CLIENT_SECRET='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'
const REDIRECT_URI='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN='1//04bymA9Y9x9mCCgYIARAAGAQSNgF-L9IrleJcYsiSX3Dy6hYl5TT6zCui4aGNNgXmrGmyd8eHY1lnOmoMfLBKvZqLJrKmHd-ZGQ'

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

const drive = google.drive({
    version:'v3',
    auth:oauth2Client
})

// Function to create a folder in Google Drive
const createFolder = async (folderName, parentFolderId = null) => {
    const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
    };

    if (parentFolderId) {
        fileMetadata.parents = [parentFolderId];
    }

    const folder = await drive.files.create({
        resource: fileMetadata,
        fields: 'id',
    });

    return folder.data.id;
}
module.exports = {createFolder}