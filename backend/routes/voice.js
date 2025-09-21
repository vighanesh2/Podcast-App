const express = require('express');
const { body, validationResult } = require('express-validator');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// @route   POST /api/voice-generation/generate-audio
// @desc    Generate audio from text using Python script
// @access  Public
router.post('/generate-audio', [
  body('text')
    .notEmpty()
    .withMessage('Text is required for audio generation'),
  body('voice_mode')
    .optional()
    .isInt({ min: 0, max: 8 })
    .withMessage('Voice mode must be an integer between 0 and 8'),
  body('filename')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Filename must be between 1 and 50 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text, voice_mode = 0, filename = 'napcast' } = req.body;

    // Create a temporary file to pass the text to Python
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempTextFile = path.join(tempDir, `${filename}_text.txt`);
    const outputAudioFile = path.join(tempDir, `${filename}.mp3`);

    // Write text to temporary file
    fs.writeFileSync(tempTextFile, text);

    // Path to your Python script
    const pythonScriptPath = path.join(__dirname, '../../voice_generator.py');

    // Spawn Python process to generate audio with environment variables
    const pythonProcess = spawn('python3', [
      pythonScriptPath,
      '--text-file', tempTextFile,
      '--output', outputAudioFile,
      '--voice-mode', voice_mode.toString(),
      '--filename', filename
    ], {
      env: {
        ...process.env,
        DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY
      }
    });

    let errorOutput = '';

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Python error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      // Clean up temporary text file
      if (fs.existsSync(tempTextFile)) {
        fs.unlinkSync(tempTextFile);
      }

      if (code !== 0) {
        console.error('Python process exited with code:', code);
        return res.status(500).json({
          success: false,
          message: 'Failed to generate audio',
          error: errorOutput
        });
      }

      // Check if audio file was created
      if (!fs.existsSync(outputAudioFile)) {
        return res.status(500).json({
          success: false,
          message: 'Audio file was not generated'
        });
      }

      // Return success with file path
      res.json({
        success: true,
        message: 'Audio generated successfully',
        data: {
          audio_path: outputAudioFile,
          filename: `${filename}.mp3`,
          voice_mode: voice_mode
        }
      });
    });

  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during voice generation'
    });
  }
});

// @route   GET /api/voice-generation/audio/:filename
// @desc    Serve generated audio file
// @access  Public
router.get('/audio/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const audioPath = path.join(__dirname, '../temp', filename);

    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({
        success: false,
        message: 'Audio file not found'
      });
    }

    res.sendFile(audioPath);
  } catch (error) {
    console.error('Audio serving error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error serving audio file'
    });
  }
});

module.exports = router;
