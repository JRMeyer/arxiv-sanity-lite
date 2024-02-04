import os

def summarize_paper(input_text):
    prompt = """
    <|system|> Hello. You are a computer science professor, and you see a colleague at a conference in the hallway. You're colleague's in a rush. You just read a new paper thought it was super interesting. Your colleague is in a rush, and has only 5 seconds to listen to you, but you really want to tell them about the paper. You must explain the paper in one sentence. Start by saying 'this paper is about...'</s>
    <|user|> Here's the paper abstract: '''The goal of voice conversion (VC) is to convert input voice to match the target speaker's voice while keeping text and prosody intact. VC is usually used in entertainment and speaking-aid systems, as well as applied for speech data generation and augmentation. The development of any-to-any VC systems, which are capable of generating voices unseen during model training, is of particular interest to both researchers and the industry. Despite recent progress, any-to-any conversion quality is still inferior to natural speech. In this work, we propose a new any-to-any voice conversion pipeline. Our approach uses automated speech recognition (ASR) features, pitch tracking, and a state-of-the-art waveform prediction model. According to multiple subjective and objective evaluations, our method outperforms modern baselines in terms of voice quality, similarity and consistency.'''</s>
    <|assistant|> This paper proposes a new pipeline for any-to-any voice conversion (VC) using ASR features, pitch tracking, and a state-of-the-art waveform prediction model, achieving better voice quality, similarity, and consistency than current baselines in subjective and objective evaluations.</s>
    <|user|> Do not include any acronyms! Your output should be less than 200 characters long.</s>
    <|assistant|> This paper proposes a pipeline for any-to-any voice conversion using speech recognition features, pitch tracking, and a waveform prediction model. It achieves better voice quality, similarity, and consistency than baselines in evaluations.</s>
    <|user|> Your reply is too long! Your colleague is in a hurry and has only 5 seconds to listen to you!</s>
        <|assistant|> This paper proposes a pipeline for any-to-any voice conversion using speech recognition features, pitch tracking, and waveform prediction. It shows excellent quality, similarity, and consistency!</s>
    <|user|> Perfect! Here's another paper abstract: ''' {} '''</s>
    <|assistant|>
    """.format(input_text)

    zephyr_model_path="static/zephyr-7b-beta.Q5_K_M.gguf"

    if not os.path.isfile(zephyr_model_path):
        from huggingface_hub import hf_hub_download
        print("I: Downloading Zephyr LLM")
        hf_hub_download(repo_id="TheBloke/zephyr-7B-beta-GGUF", local_dir="static", filename="zephyr-7b-beta.Q5_K_M.gguf")

    from llama_cpp import Llama
    
    llm_zephyr = Llama(model_path=zephyr_model_path,
                       max_new_tokens=256,
                       context_window=4096,
                       n_ctx=4096,
                       n_batch=128,
                       verbose=False
                       )
    output = llm_zephyr(prompt)
    summary = output['choices'][0]['text']
    return summary
