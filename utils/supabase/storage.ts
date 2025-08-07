import { createAdminClient } from '@/utils/supabase/admin-client'; 

/**
 * Uploads a file buffer to a specified Supabase Storage bucket.
 * This function is for server-side use only, as it uses the admin client.
 *
 * @param fileBuffer The raw file data to upload (e.g., our PNG image Buffer).
 * @param fileName The desired name for the file in the bucket (e.g., "qr-code-123.png").
 * @param bucketName The name of the Supabase bucket (e.g., "qr-png-storage").
 * @returns A Promise that resolves with the public URL of the uploaded file.
 */
export async function uploadToSupabaseStorage(
  fileBuffer: Buffer,
  fileName: string,
  bucketName: string
): Promise<string> {
  // CORRECTED: We call the function to get an instance of the admin client.
  const supabaseAdmin = createAdminClient();

  const filePath = `public/${fileName}`; 

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true, 
    });

  if (uploadError) {
    console.error('Supabase storage upload error:', uploadError);
    throw new Error('Failed to upload file to Supabase.');
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  if (!urlData.publicUrl) {
      throw new Error("File uploaded, but could not retrieve public URL from Supabase.")
  }

  console.log(`File successfully uploaded to Supabase. Public URL: ${urlData.publicUrl}`);
  return urlData.publicUrl;
}