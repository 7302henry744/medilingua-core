"""
Medical Safety Glossary.
In a real system, this would fetch from a database or TMS (Term Management System).
"""

SAFETY_GLOSSARY = {
    # Source (EN) -> Target (FI)
    "STOP": "PYSÄYTÄ",
    "EMERGENCY": "HÄTÄTILANNE",
    "DO NOT RESUSCITATE": "EI ELVYTYSKIELLOA",
    "CARDIAC ARREST": "SYDÄNPYSÄHDYS",
    "HIGH VOLTAGE": "KORKEAJÄNNITE",
    "START": "KÄYNNISTÄ",
    "CANCEL": "PERUUTA"
}

def lookup_term(text: str) -> str | None:
    """Case-insensitive exact match lookup."""
    return SAFETY_GLOSSARY.get(text.upper().strip())