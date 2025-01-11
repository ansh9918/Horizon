const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteCollection2Id: String(import.meta.env.VITE_APPWRITE_COLLECTION2_ID),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  emailServiceId: String(import.meta.env.VITE_EMAIL_SERVICE_ID),
  emailTemplateId: String(import.meta.env.VITE_EMAIL_TEMPLATE_ID),
  emailPublicKey: String(import.meta.env.VITE_EMAIL_PUBLIC_KEY),
  tinymceKey: String(import.meta.env.VITE_TINYMCE_KEY),
};

export default conf;
