import pyttsx3
from gtts import gTTS
import os
from dotenv import load_dotenv, dotenv_values 
load_dotenv()
import playsound
from deepgram import DeepgramClient, PrerecordedOptions, SpeakOptions
import logging
from deepgram.utils import verboselogs
import nltk
from nltk.tokenize import sent_tokenize
from nltk.tokenize import RegexpTokenizer
# nltk.download('punkt')
from pydub import AudioSegment
from moviepy import concatenate_audioclips, AudioFileClip

import thesaurus as th
import chat


def speak_with_pyttsx3(text, fileName="speech", rate=150, voiceType=-1):
    try:
        engine = pyttsx3.init()
        
        rate = engine.getProperty('rate')
        engine.setProperty('rate', 150)
        
        volume = engine.getProperty('volume')
        engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)
        
        if(voiceType!=-1):
            voices = engine.getProperty('voices')
            engine.setProperty('voice', voices[voiceType].id)

        engine.save_to_file(text, f'{fileName}.mp3')
        # engine.say(text)
        engine.runAndWait()

        return fileName
        
    except Exception as e:
        print(f"An error occurred with pyttsx3: {e}")

def speak_with_gtts(text, fileName):
    try:
        tts = gTTS(text=text, lang='en')
        tts.save(f'{fileName}.mp3')
    except Exception as e:
        print(f"An error occurred with gTTS: {e}")
    return fileName
        

def speakDeepGram(text, voice, fileName):
    
    deepgram = DeepgramClient(os.getenv('DEEPGRAM'))
    voiceOptions = ["aura-2-odysseus-en", "aura-2-thalia-en", "aura-2-amalthea-en", "aura-2-andromeda-en", "aura-2-apollo-en", "aura-2-arcas-en"]
    options = SpeakOptions(
        model=voiceOptions[voice], # 0-5 inclusive
    )
    response = deepgram.speak.rest.v("1").save(f'{fileName}.mp3', {"text": text}, options)

    return fileName

def deleteFile(fileName):
    if os.path.exists(fileName):
        os.remove(fileName)

def clean(text):
    return text.replace("'", '').replace('"', '').replace("_",'').replace('"','').replace('[','').replace(']','')

def buildWords(text, charLimit):
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
        # if(mode==2):
        #     speak_with_pyttsx3(text) # 0 - 176 inclusive - number 6-8 is best, 10 is bubbles...? 14 is steven hawking. 15 is miku. 170 is whisper
        return newFileName

def joinSounds(output, files):
    clips = [AudioFileClip(c) for c in files]
    final_clip = concatenate_audioclips(clips)
    final_clip.write_audiofile(f"{output}.mp3")

def speed_change(sound, speed=1.0):
        sound_with_altered_frame_rate = sound._spawn(sound.raw_data, overrides={
            "frame_rate": int(sound.frame_rate * speed)
        })
        return sound_with_altered_frame_rate.set_frame_rate(sound.frame_rate)

def organizeSpeech(text, mode, voice, fileName='speech', rate=1.0):
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

def stupify(text):
    tokenizer = RegexpTokenizer(r'\w+')
    tokenized = tokenizer.tokenize(text)
    complete = ''
    for i in tokenized:
        complete+= th.getSyn(i)
    return complete



def createVoiceOver(text, mode, stupify=False):
    if(stupify):
        text = stupify(text)
        print(text)
    if(mode==0):
        organizeSpeech(text, 0, 5, 'audio', 0.8) # Boring sleepy
    if(mode==1):
        organizeSpeech(text, 0, 2, 'audio', 1.7) # chipmunk?
    if(mode==2):
        organizeSpeech(text, 1, 0, 'audio', 0.5) # slow gtts. rate adjustable
    if(mode==3):
        organizeSpeech(text, 1, 5, 'audio', 1) # basic gtts
    if(mode > 3):
        organizeSpeech(text, 0, mode-3, 'audio', 1) # additional deepgram voices

def generateVoiceOver(mode, stupify=False):
    text = chat.ask('Make a boring podcast script')
    if(stupify):
        text = stupify(text)
        print(text)
    if(mode==0):
        organizeSpeech(text, 0, 5, 'audio', 0.8) # Boring sleepy
    if(mode==1):
        organizeSpeech(text, 0, 2, 'audio', 1.7) # chipmunk?
    if(mode==2):
        organizeSpeech(text, 1, 0, 'audio', 0.5) # slow gtts. rate adjustable
    if(mode==3):
        organizeSpeech(text, 1, 5, 'audio', 1) # basic gtts
    if(mode > 3):
        organizeSpeech(text, 0, mode-3, 'audio', 1) # additional deepgram voices


# createVoiceOver(text, 0-8): import nltk
# nltk.download('wordnet')
from nltk.corpus import wordnet
import random

def getAnt(word):
    antonyms = []
    for syn in wordnet.synsets(word):
        for l in syn.lemmas():
            if l.antonyms():
                antonyms.append(l.antonyms()[0].name())
    if(len(antonyms) > 0):
        return antonyms[random.randint(0,len(antonyms)-1)]
    return word


def getSyn(word):
    synonyms = []
    for syn in wordnet.synsets(word):
        for l in syn.lemmas():
            synonyms.append(l.name())
    if(len(synonyms) > 0):
        return synonyms[random.randint(0,len(antonyms)-1)]
    return word

# Main function to generate audio from text
def generate_audio_from_text(text, voice_mode=0, output_filename="napcast"):
    """
    Generate MP3 audio from text using the voice generation system
    
    Args:
        text (str): The text to convert to speech
        voice_mode (int): Voice mode (0-8)
        output_filename (str): Name for the output MP3 file
    
    Returns:
        str: Path to the generated MP3 file
    """
    try:
        # Create audio directory if it doesn't exist
        audio_dir = "generated_audio"
        if not os.path.exists(audio_dir):
            os.makedirs(audio_dir)
        
        # Generate the audio file
        createVoiceOver(text, voice_mode, stupify=False)
        
        # Move the generated file to the audio directory with proper naming
        source_file = "audio.mp3"
        destination_file = os.path.join(audio_dir, f"{output_filename}.mp3")
        
        if os.path.exists(source_file):
            os.rename(source_file, destination_file)
            return destination_file
        else:
            raise Exception("Audio file was not generated successfully")
            
    except Exception as e:
        print(f"Error generating audio: {e}")
        return None

if __name__ == "__main__":
    # Test the function
    test_text = "Welcome to NapCast, your ultimate sleep companion. Let's drift away into peaceful slumber."
    result = generate_audio_from_text(test_text, voice_mode=0, output_filename="test_napcast")
    print(f"Audio generated: {result}")
