import os
import time
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from .glossary import lookup_term

# Load env vars
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class AITranslator:
    def __init__(self):
        # If no key is provided, we default to Simulation Mode to prevent crashes
        self.use_mock = not bool(OPENAI_API_KEY)
        if not self.use_mock:
            self.llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
            self.parser = StrOutputParser()
            
            # Prompt Engineering: Enforce medical tone
            template = """
            You are a medical localization expert for GE HealthCare. 
            Translate the following text from English to Finnish.
            
            Rules:
            1. Use professional medical terminology.
            2. Keep it concise (for embedded screens).
            3. Do not add explanations, just the translation.
            
            Text: {text}
            """
            self.prompt = ChatPromptTemplate.from_template(template)
            self.chain = self.prompt | self.llm | self.parser
        else:
            print("⚠️  WARNING: No OPENAI_API_KEY found. Running in SIMULATION MODE.")

    async def translate(self, text: str) -> str:
        """
        Hybrid Translation Strategy:
        1. Check Glossary (Deterministic)
        2. Ask AI (Probabilistic)
        """
        # 1. Safety Glossary Check
        glossary_match = lookup_term(text)
        if glossary_match:
            return glossary_match

        # 2. LLM / Simulation
        if self.use_mock:
            # Simulate network latency
            time.sleep(0.1) 
            # Mock translation logic: Append [FI] and length simulation
            return f"[FI] {text}"
        
        try:
            return await self.chain.ainvoke({"text": text})
        except Exception as e:
            print(f"AI Error: {e}")
            return f"[ERR] {text}"

# Singleton
translator = AITranslator()