#!/usr/bin/env python3
"""
Voice Generator Script for NapCast App
This script integrates with the Node.js backend to generate audio from text.
"""

import argparse
import os
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def speak_with_pyttsx3(text, fileName="speech", rate=150, voiceType=-1):
    try:
        import pyttsx3
        engine = pyttsx3.init()
        
        rate = engine.getProperty('rate')
        engine.setProperty('rate', 150)
        
        volume = engine.getProperty('volume')
        engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)
        
        if(voiceType!=-1):
            voices = engine.getProperty('voices')
            engine.setProperty('voice', voices[voiceType].id)

        engine.save_to_file(text, f'{fileName}.mp3')
        engine.runAndWait()

        return fileName
        
    except Exception as e:
        print(f"An error occurred with pyttsx3: {e}")

def speak_with_gtts(text, fileName):
    try:
        from gtts import gTTS
        tts = gTTS(text=text, lang='en')
        tts.save(f'{fileName}.mp3')
    except Exception as e:
        print(f"An error occurred with gTTS: {e}")
    return fileName
        

def speakDeepGram(text, voice, fileName):
    try:
        from deepgram import DeepgramClient, SpeakOptions
        # Load API key from environment variable
        api_key = os.getenv('DEEPGRAM_API_KEY')
        if not api_key:
            raise ValueError("DEEPGRAM_API_KEY not found in environment variables")
        
        deepgram = DeepgramClient(api_key)
        voiceOptions = ["aura-2-odysseus-en", "aura-2-thalia-en", "aura-2-amalthea-en", "aura-2-andromeda-en", "aura-2-apollo-en", "aura-2-arcas-en"]
        options = SpeakOptions(
            model=voiceOptions[voice], # 0-5 inclusive
        )
        response = deepgram.speak.v("1").save(f'{fileName}.mp3', {"text": text}, options)

        return fileName
    except Exception as e:
        print(f"An error occurred with Deepgram: {e}")
        return None

def deleteFile(fileName):
    if os.path.exists(fileName):
        os.remove(fileName)

def clean(text):
    return text.replace("'", '').replace('"', '').replace("_",'').replace('"','').replace('[','').replace(']','')

def buildWords(text, charLimit):
    import nltk
    from nltk.tokenize import RegexpTokenizer
    
    query = ""
    rest = ""
    stop = False
    tokenizer = RegexpTokenizer(r'\w+')
    tokenized = tokenizer.tokenize(text)
    if(len(tokenized[0]) > charLimit):
        return "I give up."
    for sent in tokenized:
        
        if stop == False and len(query)+len(sent) <= charLimit:
            query+=' '+sent
        else:
            stop = True
            rest+=' '+sent
    
    query = query.strip()
    rest = rest.strip()

    list = [query]
    if(len(rest)>0):
        list += buildSentence(rest, charLimit)
    return list

def buildSentence(text, charLimit):
    import nltk
    from nltk.tokenize import sent_tokenize
    
    query = ""
    rest = ""
    stop = False
    tokenized = sent_tokenize(text)
    if(len(tokenized[0]) > charLimit):
        return buildWords(text, charLimit)
    for sent in tokenized:
        if stop == False and len(query)+len(sent) <= charLimit:
            query+=sent
        else:
            stop = True
            rest+=sent

    list = [query]
    if(len(rest)>0):
        list += buildSentence(rest, charLimit)
    return list

def playSpeech(text, mode, fileName, iteration, voice):
    newFileName = fileName+str(iteration)
    if(mode==0):
        speakDeepGram(text, voice, newFileName)
    if(mode==1):
        speak_with_gtts(text, newFileName)
    return newFileName

def joinSounds(output, files):
    from moviepy.editor import concatenate_audioclips, AudioFileClip
    clips = [AudioFileClip(c) for c in files]
    final_clip = concatenate_audioclips(clips)
    final_clip.write_audiofile(f"{output}.mp3")

def speed_change(sound, speed=1.0):
    from pydub import AudioSegment
    sound_with_altered_frame_rate = sound._spawn(sound.raw_data, overrides={
        "frame_rate": int(sound.frame_rate * speed)
    })
    return sound_with_altered_frame_rate.set_frame_rate(sound.frame_rate)

def organizeSpeech(text, mode, voice, fileName='speech', rate=1.0):
    from pydub import AudioSegment
    from moviepy.editor import concatenate_audioclips, AudioFileClip
    
    build = buildSentence(clean(text), 2000)
    counter = 0
    files = []
    for section in build:
        files.append(f'{playSpeech(section, mode, fileName, counter, voice)}.mp3')
        counter+=1
    
    clips = [AudioFileClip(c) for c in files]
    final_clip = concatenate_audioclips(clips)
    final_clip.write_audiofile("temp.mp3")

    sound = AudioSegment.from_file("temp.mp3")
    newSound = speed_change(sound, rate)
    newSound.export(f"{fileName}.mp3", format="mp3")

    deleteFile("temp.mp3")
    for clip in files:
        deleteFile(clip)

def createVoiceOver(text, mode, stupify=False):
    if(stupify):
        # Import thesaurus if available
        try:
            import thesaurus as th
            from nltk.tokenize import RegexpTokenizer
            tokenizer = RegexpTokenizer(r'\w+')
            tokenized = tokenizer.tokenize(text)
            complete = ''
            for i in tokenized:
                complete+= th.getSyn(i)
            text = complete
            print(text)
        except ImportError:
            print("Thesaurus module not available, skipping stupify")
    
    if(mode==0):
        organizeSpeech(text, 0, 5, 'audio', 0.8) # Boring sleepy
    elif(mode==1):
        organizeSpeech(text, 0, 2, 'audio', 1.7) # chipmunk?
    elif(mode==2):
        organizeSpeech(text, 1, 0, 'audio', 0.5) # slow gtts. rate adjustable
    elif(mode==3):
        organizeSpeech(text, 1, 5, 'audio', 1) # basic gtts
    elif(mode > 3):
        organizeSpeech(text, 0, mode-3, 'audio', 1) # additional deepgram voices

def main():
    parser = argparse.ArgumentParser(description='Generate audio from text for NapCast')
    parser.add_argument('--text-file', required=True, help='Path to text file containing the script')
    parser.add_argument('--output', required=True, help='Output audio file path')
    parser.add_argument('--voice-mode', type=int, default=0, choices=range(9), help='Voice mode (0-8)')
    parser.add_argument('--filename', default='napcast', help='Base filename for output')
    parser.add_argument('--stupify', action='store_true', help='Apply stupify transformation')
    
    args = parser.parse_args()
    
    try:
        # Read text from file
        with open(args.text_file, 'r', encoding='utf-8') as f:
            text = f.read()
        
        # Generate voice over
        createVoiceOver(text, args.voice_mode, args.stupify)
        
        # Move the generated file to the output location
        generated_file = 'audio.mp3'
        if os.path.exists(generated_file):
            os.rename(generated_file, args.output)
            print(f"Audio generated successfully: {args.output}")
        else:
            print("Error: Audio file was not generated")
            sys.exit(1)
            
    except Exception as e:
        print(f"Error generating audio: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
