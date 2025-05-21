import os, sys, cv2, numpy as np
import torch
import audio
from models import Wav2Lip
from hparams import hparams
import argparse
import subprocess
from tqdm import tqdm
# from face_detection import load_face_detector, get_faces

def load_model(path):
    model = Wav2Lip()
    checkpoint = torch.load(path, map_location=torch.device('cpu'))
    model.load_state_dict(checkpoint['state_dict'])
    model = model.eval()
    return model

def main(args):
    face = cv2.imread(args.face)
    if face is None:
        print("❌ Could not read face image.")
        return

    wav = audio.load_wav(args.audio, hparams.sample_rate)
    mel = audio.melspectrogram(wav)
    mel_chunks = audio.chunk_mel_spectrogram(mel)

    print(f"✔ Loaded audio and extracted {len(mel_chunks)} mel chunks.")

    model = load_model(args.checkpoint_path)

    results = []
    for mel in tqdm(mel_chunks, desc="Lip-syncing"):
        img = cv2.resize(face, (96, 96))
        img = img / 255.0
        img = img.transpose(2, 0, 1)
        img = torch.FloatTensor(img).unsqueeze(0)
        mel = torch.FloatTensor(mel).unsqueeze(0).unsqueeze(0)
        with torch.no_grad():
            out = model(img, mel)
        results.append(out.squeeze(0).permute(1, 2, 0).numpy())

    out_path = args.outfile
    out_video = cv2.VideoWriter(out_path, cv2.VideoWriter_fourcc(*'mp4v'), 25, (96, 96))
    for frame in results:
        frame = (frame * 255).astype(np.uint8)
        out_video.write(frame)
    out_video.release()

    print("✅ Video saved to:", out_path)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--checkpoint_path', required=True, help="Path to .pth file")
    parser.add_argument('--face', required=True, help="Path to face image")
    parser.add_argument('--audio', required=True, help="Path to audio")
    parser.add_argument('--outfile', required=True, help="Path to save output video")
    args = parser.parse_args()
    main(args)
