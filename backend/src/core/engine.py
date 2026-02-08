from PIL import ImageFont
import os

# Configuration
FONT_PATH = "/app/assets/fonts/Roboto-Medium.ttf"
DEFAULT_FONT_SIZE = 16

class WidthEngine:
    def __init__(self):
        self._font_cache = {}

    def _get_font(self, size: int):
        if size not in self._font_cache:
            try:
                self._font_cache[size] = ImageFont.truetype(FONT_PATH, size)
            except IOError:
                # Fallback for dev environments if download failed
                print(f"WARNING: Could not load {FONT_PATH}, using default.")
                self._font_cache[size] = ImageFont.load_default()
        return self._font_cache[size]

    def calculate_width(self, text: str, font_size: int = DEFAULT_FONT_SIZE) -> int:
        """
        Calculates the exact pixel width of the text string.
        """
        if not text:
            return 0
        
        font = self._get_font(font_size)
        # getlength returns float, we round up for safety (conservative estimate)
        return int(font.getlength(text)) + 1

# Singleton instance
width_engine = WidthEngine()