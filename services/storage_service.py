import os
import shutil
import logging
from app.config import settings

logger = logging.getLogger("ai_interviewer.storage")

class StorageService:
    """File storage service supporting local dev storage and Cloudinary production storage."""

    def __init__(self):
        self.use_cloudinary = bool(
            settings.CLOUDINARY_CLOUD_NAME and
            settings.CLOUDINARY_API_KEY and
            settings.CLOUDINARY_API_SECRET
        )
        if self.use_cloudinary:
            try:
                import cloudinary
                import cloudinary.uploader
                cloudinary.config(
                    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                    api_key=settings.CLOUDINARY_API_KEY,
                    api_secret=settings.CLOUDINARY_API_SECRET
                )
                logger.info("Configured Cloudinary for production file storage.")
            except Exception as e:
                logger.warning(f"Cloudinary setup failed: {e}. Falling back to local storage.")
                self.use_cloudinary = False

    def save_file(self, file_bytes: bytes, filename: str, folder: str = "interviews") -> str:
        """Save raw bytes to storage and return public path or URL."""
        if self.use_cloudinary:
            try:
                import cloudinary.uploader
                result = cloudinary.uploader.upload(
                    file_bytes,
                    folder=folder,
                    resource_type="auto"
                )
                return result.get("secure_url", "")
            except Exception as e:
                logger.error(f"Cloudinary upload failed: {e}. Falling back to local disk.")

        # Local disk storage fallback
        target_dir = os.path.join(settings.UPLOAD_DIR, folder)
        os.makedirs(target_dir, exist_ok=True)
        file_path = os.path.join(target_dir, filename)

        with open(file_path, "wb") as f:
            f.write(file_bytes)

        return f"/uploads/{folder}/{filename}"

storage_manager = StorageService()
