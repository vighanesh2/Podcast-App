# Documentation

## Data Scraping

To fine tune an LLM to generate boring sleep podcasts, we scraped data from different existing sleep podcasts. To do this, we started by researching some popular sleep podcasts and gathering their RSS feeds. From each RSS feed we take the `.mp3` file of a podcast episode, and then transcribe it into text with OpenAI's [Whisper](https://github.com/openai/whisper) model. Because different podcasts have different lengths, we split the transcripts up into smaller chunks for model training.
