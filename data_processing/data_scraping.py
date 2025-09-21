import requests
from bs4 import BeautifulSoup
import pandas as pd
import whisper
import os
import torch

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(device)
model = whisper.load_model('base').to(device)

feeds = [('Sleep With Me', 'https://feed.sleepwithmepodcast.com/'), ('Nothing Much Happens', 'https://feeds.megaphone.fm/SSM2868305742'), ('Sleepy History', 'https://feeds.megaphone.fm/sleepyhistory'), ('Sleepy Stories: To help you sleep', 'https://www.spreaker.com/show/5818206/episodes/feed')]
output = []
temp_output = []
exports = 0
restart = -1

for name,url in feeds:
    resp = requests.get(url)
    soup = BeautifulSoup(resp.text, 'xml')

    i = 0
    for entry in soup.find_all('item'):
        if (exports == 0 and i < restart):
            i += 1
            continue
        enclosure = entry.find('enclosure')
        audio_url = enclosure['url'] if enclosure else None
        transcript_text = None
        i += 1
        
        if (i % 10 == 0):
            print('downloading...', exports)

        if audio_url:
            filename = "temp.mp3"
            audio_data = requests.get(audio_url)
            with open(filename, "wb") as f:
                f.write(audio_data.content)
            # Whisper transcribes
            result = model.transcribe(filename)
            transcript_text = result.get("text", "")
            os.remove(filename)

        item = {
            'Title': entry.find('title').text if entry.find('title') else None,
            'Podcast': name,
            'Pubdate': entry.find('pubDate').text if entry.find('pubDate') else None,
            'Content': entry.find('description').text if entry.find('description') else None,
            'Link': entry.find('link').text if entry.find('link') else None,
            'AudioURL': audio_url,
            'Transcript': transcript_text
        }
        output.append(item)
        temp_output.append(item)
        if (i % 10 == 0):
            print(i)
            temp_df = pd.DataFrame(temp_output)
            temp_df.to_csv(f'data_{exports}_{i}.csv', index=False)
            exports += 1
            temp_output = []

df = pd.DataFrame(output)
df.to_csv(f'results_feed_{url.split("/")[2]}.csv', index=False)
df["TextLength"] = df["Transcript"].astype(str).str.len()
print(df.head())