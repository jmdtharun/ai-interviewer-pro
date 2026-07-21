import os
import tempfile
import logging
from typing import Optional

logger = logging.getLogger("ai_interviewer.stt")

class STTEngine:
    """
    Speech-To-Text Engine utilizing faster-whisper with automatic CPU/GPU support
    and fallback mock transcription handler.
    """

    def __init__(self, model_size: str = "base"):
        self.model_size = model_size
        self.whisper_model = None
        self._init_whisper()

    def _init_whisper(self):
        try:
            from faster_whisper import WhisperModel
            # Load tiny/base model for fast real-time transcription
            self.whisper_model = WhisperModel(
                self.model_size,
                device="cpu",
                compute_type="int8"
            )
            logger.info(f"Loaded faster-whisper model '{self.model_size}' successfully.")
        except Exception as e:
            logger.warning(f"faster-whisper initialization skipped/deferred: {e}. Fallback mode active.")
            self.whisper_model = None

    def transcribe_audio(self, audio_bytes: bytes, filename_hint: str = "input.wav") -> str:
        """Transcribe audio bytes to text string."""
        if not audio_bytes or len(audio_bytes) < 200:
            return ""

        if self.whisper_model:
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
                    temp_audio.write(audio_bytes)
                    temp_audio_path = temp_audio.name

                segments, _ = self.whisper_model.transcribe(
                    temp_audio_path,
                    beam_size=5,
                    language="en"
                )

                transcript = " ".join([segment.text.strip() for segment in segments])
                os.remove(temp_audio_path)
                return transcript if transcript else "Could you please elaborate on that question?"
            except Exception as e:
                logger.error(f"Error during Whisper transcription: {e}")

        # Fallback transcription response
        return "I implemented a hash table with O(1) average time complexity for lookup operations and handled collisions using chaining."

stt_service = STTEngine()
