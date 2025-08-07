import { NextResponse } from 'next/server';
import { generateQRCodeBuffer } from '@/utils/qrapp/helpers';
import { uploadToSupabaseStorage } from '@/utils/supabase/storage';

// This function handles the test request from our UI.
export async function POST() {
  try {
    // 1. We'll use some static test data for this controlled test.
    const testData = `https://stark-industries.com/test-upload-${Date.now()}`;
    console.log(`[API Test] Generating QR code for: ${testData}`);

    // 2. Call our first utility to get the PNG buffer.
    const qrBuffer = await generateQRCodeBuffer(testData);
    console.log('[API Test] PNG Buffer generated successfully.');

    // 3. Call our second utility to upload the buffer to Supabase.
    const fileName = `test-from-ui-${Date.now()}.png`;
    const bucketName = 'qr-png-storage'; // The bucket name we created.
    
    console.log(`[API Test] Uploading ${fileName} to bucket ${bucketName}...`);
    const publicUrl = await uploadToSupabaseStorage(qrBuffer, fileName, bucketName);

    // 4. If everything works, return the final public URL.
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error: any) {
    console.error('[API Test] Error during test upload:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}