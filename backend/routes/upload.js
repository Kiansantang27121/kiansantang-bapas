import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { convertToMP4, isVideoFile, checkFFmpeg } from '../utils/videoConverter.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = join(__dirname, '..', 'uploads');
const tempDir = join(__dirname, '..', 'temp');

// Ensure directories exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Check FFmpeg availability on startup
let ffmpegAvailable = false;
checkFFmpeg().then(available => {
  ffmpegAvailable = available;
  if (!available) {
    console.warn('⚠️  FFmpeg not found. Video conversion will be disabled.');
    console.warn('   Install FFmpeg: https://ffmpeg.org/download.html');
  } else {
    console.log('✅ FFmpeg is available for video conversion');
  }
});

// File upload handler with video conversion
router.post('/file', authenticateToken, requireAdmin, async (req, res) => {
  let tempFilePath = null;
  let finalFilePath = null;

  try {
    const { filename, data, type } = req.body;

    if (!filename || !data) {
      return res.status(400).json({ error: 'Filename and data required' });
    }

    // Remove data URL prefix if present
    const base64Data = data.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
    
    // Generate unique filename
    const timestamp = Date.now();
    const ext = filename.split('.').pop().toLowerCase();
    const isVideo = type === 'video' && isVideoFile(filename);

    // For video files, save to temp first
    if (isVideo) {
      const tempFilename = `temp_${timestamp}.${ext}`;
      tempFilePath = join(tempDir, tempFilename);
      
      // Write temp file
      fs.writeFileSync(tempFilePath, base64Data, 'base64');
      console.log('Video uploaded to temp:', tempFilename);

      // Check if conversion needed (not MP4)
      if (ext !== 'mp4' && ffmpegAvailable) {
        console.log(`Converting ${ext} to MP4...`);
        
        const outputFilename = `video_${timestamp}.mp4`;
        finalFilePath = join(uploadsDir, outputFilename);

        try {
          // Convert to MP4
          await convertToMP4(tempFilePath, finalFilePath);
          
          // Delete temp file
          fs.unlinkSync(tempFilePath);
          tempFilePath = null;

          console.log('Conversion successful:', outputFilename);
          
          const fileUrl = `/uploads/${outputFilename}`;
          return res.json({ 
            url: fileUrl, 
            filename: outputFilename,
            converted: true,
            originalFormat: ext
          });
        } catch (conversionError) {
          console.error('Conversion failed:', conversionError);
          
          // If conversion fails, use original file
          if (ext === 'mp4' || ext === 'webm') {
            // Move temp to uploads
            const fallbackFilename = `video_${timestamp}.${ext}`;
            finalFilePath = join(uploadsDir, fallbackFilename);
            fs.renameSync(tempFilePath, finalFilePath);
            tempFilePath = null;

            const fileUrl = `/uploads/${fallbackFilename}`;
            return res.json({ 
              url: fileUrl, 
              filename: fallbackFilename,
              converted: false,
              warning: 'Conversion failed, using original format'
            });
          } else {
            throw new Error(`Unsupported video format: ${ext}. Conversion failed.`);
          }
        }
      } else {
        // MP4 or FFmpeg not available, move directly
        const newFilename = `video_${timestamp}.${ext}`;
        finalFilePath = join(uploadsDir, newFilename);
        fs.renameSync(tempFilePath, finalFilePath);
        tempFilePath = null;

        const fileUrl = `/uploads/${newFilename}`;
        return res.json({ 
          url: fileUrl, 
          filename: newFilename,
          converted: false
        });
      }
    } else {
      // Non-video files (logo, etc)
      const newFilename = `${type}_${timestamp}.${ext}`;
      finalFilePath = join(uploadsDir, newFilename);
      
      // Write file directly
      fs.writeFileSync(finalFilePath, base64Data, 'base64');

      const fileUrl = `/uploads/${newFilename}`;
      return res.json({ url: fileUrl, filename: newFilename });
    }
  } catch (error) {
    console.error('Upload error:', error);
    
    // Cleanup temp files on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    if (finalFilePath && fs.existsSync(finalFilePath)) {
      fs.unlinkSync(finalFilePath);
    }

    res.status(500).json({ error: error.message || 'Failed to upload file' });
  }
});

// Delete file
router.delete('/file/:filename', authenticateToken, requireAdmin, (req, res) => {
  try {
    const filepath = join(uploadsDir, req.params.filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
