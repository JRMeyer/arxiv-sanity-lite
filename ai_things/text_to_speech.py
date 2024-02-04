
def generate_tts(pid,text_input):
    from TTS.api import TTS
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
    # generate speech by cloning a voice using default settings
    audio_path=f"static/audio/{pid}.wav"
    tts.tts_to_file(text=text_input,
                    speaker_wav=["/Users/josh/Downloads/roboqui.wav"],
                    file_path="/Users/josh/arxiv-sanity-lite/"+audio_path,
                    language="en")
    return audio_path
