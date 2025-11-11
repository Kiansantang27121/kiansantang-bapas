import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supported input formats
export const SUPPORTED_VIDEO_FORMATS = [
  'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 
  'mpeg', 'mpg', '3gp', 'm4v', 'ogv', 'vob', 'ts'
];

// Check if file is video
export function isVideoFile(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return SUPPORTED_VIDEO_FORMATS.includes(ext);
}

// Convert video to MP4 (H.264)
export function convertToMP4(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    console.log('Converting video to MP4...');
    console.log('Input:', inputPath);
    console.log('Output:', outputPath);

    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('mp4')
      .outputOptions([
        '-preset fast',
        '-crf 23',
        '-movflags +faststart',
        '-vf scale=1280:720:force_original_aspect_ratio=decrease',
        '-r 30',
        '-b:a 128k'
      ])
      .on('start', (commandLine) => {
        console.log('FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        console.log('Processing:', progress.percent ? progress.percent.toFixed(2) + '%' : 'N/A');
      })
      .on('end', () => {
        console.log('Conversion completed successfully');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Conversion error:', err);
        reject(err);
      })
      .save(outputPath);
  });
}

// Get video info
export function getVideoInfo(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
}

// Check if FFmpeg is installed
export function checkFFmpeg() {
  return new Promise((resolve) => {
    ffmpeg.getAvailableFormats((err, formats) => {
      if (err) {
        console.error('FFmpeg not found or not working');
        resolve(false);
      } else {
        console.log('FFmpeg is available');
        resolve(true);
      }
    });
  });
}

export default {
  convertToMP4,
  getVideoInfo,
  isVideoFile,
  checkFFmpeg,
  SUPPORTED_VIDEO_FORMATS
};
