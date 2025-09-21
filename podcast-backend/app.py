from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from routes.auth import auth_bp
from routes.user_prompts import user_prompts_bp
from routes.podcast_episodes import podcast_episodes_bp
from routes.voice_generation_jobs import voice_jobs_bp
from routes.voice_generation import voice_generation_bp
from routes.rss_feeds import rss_feeds_bp
from routes.analytics import analytics_bp
from routes.content_templates import content_templates_bp
from routes.system_config import system_config_bp
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
import torch

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['podcastDB']

# Make db available to routes
@app.before_request
def before_request():
    request.db = db

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/users')
app.register_blueprint(user_prompts_bp, url_prefix='/api/user-prompts')
app.register_blueprint(podcast_episodes_bp, url_prefix='/api/podcast-episodes')
app.register_blueprint(voice_jobs_bp, url_prefix='/api/voice-generation-jobs')
app.register_blueprint(voice_generation_bp, url_prefix='/api/voice-generation')
app.register_blueprint(rss_feeds_bp, url_prefix='/api/rss-feeds')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(content_templates_bp, url_prefix='/api/content-templates')
app.register_blueprint(system_config_bp, url_prefix='/api/system-config')

# Test route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'success',
        'message': 'Podcast API is running!',
        'database': 'connected' if db.command('ping') else 'disconnected'
    })

# <<<<<<< HEAD
# print("STARTING MODEL STUFF")

# # Load the Large Language Model (LLM)

# model_id = "meta-llama/Meta-Llama-3-8B"
# adapter_dir = "./lora_adapter_initial"

# print("HI")

# bnb_config = BitsAndBytesConfig(
#     load_in_4bit=True,                 # Switch to 4-bit
#     bnb_4bit_use_double_quant=True,    # Double quantization to save memory
#     bnb_4bit_quant_type="nf4",         # Best quantization type for accuracy
#     bnb_4bit_compute_dtype="float16"   # Use fp16 math (fp32 is slower but safer)
# )

# base_model = AutoModelForCausalLM.from_pretrained(
#     model_id,
#     quantization_config=bnb_config,
#     device_map="auto",
# )

# print("Loading tokenizer...")
# tokenizer = AutoTokenizer.from_pretrained(model_id)
# if tokenizer.pad_token is None:
#     tokenizer.pad_token = tokenizer.eos_token

# print("Attaching LoRA adapter...")
# model = PeftModel.from_pretrained(base_model, adapter_dir)
# model.eval()

# =======
# >>>>>>> main
if __name__ == '__main__':
    app.run(debug=True, port=5000)