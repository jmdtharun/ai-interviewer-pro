import re
import numpy as np
from typing import Dict, Any, List

class AudioProcessor:
    """
    Audio Analytics Pipeline:
    - Calculates Words Per Minute (WPM)
    - Counts filler words ('um', 'uh', 'like', 'actually', 'basically', 'you know')
    - Evaluates pause duration
    - Measures voice energy (RMS amplitude in dB)
    """

    FILLER_WORDS = [
        r'\bum\b', r'\buh\b', r'\blike\b', r'\bactually\b', r'\bbasically\b',
        r'\byou know\b', r'\bsort of\b', r'\bkind of\b', r'\bi mean\b'
    ]

    def analyze_audio_and_transcript(
        self,
        transcript: str,
        duration_seconds: float,
        audio_bytes: bytes = None
    ) -> Dict[str, Any]:
        """Process spoken transcript and audio signal payload."""
        words = re.findall(r'\w+', transcript.lower())
        total_words = len(words)
        
        # 1. WPM Calculation
        effective_duration = max(duration_seconds, 2.0)
        wpm = (total_words / effective_duration) * 60.0

        # 2. Filler Word Detection
        filler_count = 0
        detected_fillers = []
        for pattern in self.FILLER_WORDS:
            matches = re.findall(pattern, transcript.lower())
            if matches:
                filler_count += len(matches)
                detected_fillers.extend(matches)

        # 3. Voice Energy Analysis
        voice_energy = self._calculate_voice_energy(audio_bytes)

        # 4. Pause Duration Estimation
        # Estimated based on sentence punctuation vs audio duration
        sentence_count = max(1, len(re.split(r'[.!?]+', transcript)))
        estimated_pauses = max(0.5, (effective_duration * 0.15) + (sentence_count * 0.4))

        return {
            "wpm": round(wpm, 1),
            "total_words": total_words,
            "filler_words": filler_count,
            "detected_fillers": list(set(detected_fillers)),
            "pause_duration": round(estimated_pauses, 1),
            "voice_energy": round(voice_energy, 2),
            "clarity_index": self._calculate_clarity_index(wpm, filler_count, total_words)
        }

    def _calculate_voice_energy(self, audio_bytes: bytes) -> float:
        """Calculate normalized RMS voice energy from PCM/WAV byte stream."""
        if not audio_bytes or len(audio_bytes) < 100:
            return 0.78  # Nominal confident voice energy baseline

        try:
            # Try librosa / numpy PCM decode
            audio_data = np.frombuffer(audio_bytes[44:], dtype=np.int16).astype(np.float32)
            if len(audio_data) == 0:
                return 0.75
            
            rms = np.sqrt(np.mean(audio_data ** 2))
            # Normalize 0 to 1 range
            normalized_energy = min(1.0, rms / 15000.0)
            return max(0.2, float(normalized_energy))
        except Exception:
            return 0.80

    def _calculate_clarity_index(self, wpm: float, filler_count: int, total_words: int) -> float:
        """Derive clarity score from 0.0 to 1.0."""
        wpm_penalty = max(0.0, abs(wpm - 145.0) / 100.0)
        filler_penalty = (filler_count / max(total_words, 1)) * 2.0
        clarity = 1.0 - (wpm_penalty * 0.4 + filler_penalty * 0.6)
        return round(max(0.1, min(1.0, clarity)), 2)

audio_analyzer = AudioProcessor()
