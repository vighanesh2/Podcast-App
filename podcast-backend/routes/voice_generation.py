from flask import Blueprint, request, jsonify, send_file
import os
import uuid
from datetime import datetime
from voice_generator import generate_audio_from_text
import logging

# Create blueprint
voice_generation_bp = Blueprint('voice_generation', __name__)

@voice_generation_bp.route('/generate-audio', methods=['POST'])
def generate_audio():
    """
    Generate MP3 audio from text
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Text is required'
            }), 400
        
        text = data['text']
        voice_mode = data.get('voice_mode', 0)  # Default to sleepy voice
        output_filename = data.get('filename', f"napcast_{uuid.uuid4().hex[:8]}")
        
        if not text.strip():
            return jsonify({
                'status': 'error',
                'message': 'Text cannot be empty'
            }), 400
        
        # Generate the audio file
        audio_path = generate_audio_from_text(text, voice_mode, output_filename)
        
        if audio_path and os.path.exists(audio_path):
            return jsonify({
                'status': 'success',
                'message': 'Audio generated successfully',
                'audio_path': audio_path,
                'filename': f"{output_filename}.mp3",
                'voice_mode': voice_mode,
                'generated_at': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to generate audio file'
            }), 500
            
    except Exception as e:
        logging.error(f"Error generating audio: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Internal server error: {str(e)}'
        }), 500

@voice_generation_bp.route('/download-audio/<filename>', methods=['GET'])
def download_audio(filename):
    """
    Download generated audio file
    """
    try:
        audio_dir = "generated_audio"
        file_path = os.path.join(audio_dir, filename)
        
        if not os.path.exists(file_path):
            return jsonify({
                'status': 'error',
                'message': 'Audio file not found'
            }), 404
        
        return send_file(file_path, as_attachment=True, download_name=filename)
        
    except Exception as e:
        logging.error(f"Error downloading audio: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error downloading file: {str(e)}'
        }), 500

@voice_generation_bp.route('/voice-modes', methods=['GET'])
def get_voice_modes():
    """
    Get available voice modes
    """
    voice_modes = [
        {
            'id': 0,
            'name': 'Sleepy Voice',
            'description': 'Slow, calming voice perfect for sleep',
            'speed': 0.8
        },
        {
            'id': 1,
            'name': 'Chipmunk Voice',
            'description': 'High-pitched, energetic voice',
            'speed': 1.7
        },
        {
            'id': 2,
            'name': 'Slow Google TTS',
            'description': 'Very slow Google Text-to-Speech',
            'speed': 0.5
        },
        {
            'id': 3,
            'name': 'Standard Google TTS',
            'description': 'Normal speed Google Text-to-Speech',
            'speed': 1.0
        },
        {
            'id': 4,
            'name': 'Deepgram Odysseus',
            'description': 'Deepgram voice - Odysseus',
            'speed': 1.0
        },
        {
            'id': 5,
            'name': 'Deepgram Thalia',
            'description': 'Deepgram voice - Thalia',
            'speed': 1.0
        },
        {
            'id': 6,
            'name': 'Deepgram Amalthea',
            'description': 'Deepgram voice - Amalthea',
            'speed': 1.0
        },
        {
            'id': 7,
            'name': 'Deepgram Andromeda',
            'description': 'Deepgram voice - Andromeda',
            'speed': 1.0
        },
        {
            'id': 8,
            'name': 'Deepgram Apollo',
            'description': 'Deepgram voice - Apollo',
            'speed': 1.0
        }
    ]
    
    return jsonify({
        'status': 'success',
        'voice_modes': voice_modes
    })
