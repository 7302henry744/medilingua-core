import os
import time
import json
from typing import List
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from .glossary import lookup_term
from .schemas import Segment

# Load env vars
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class AITranslator:
    def __init__(self):
        # If no key is provided, we default to Simulation Mode to prevent crashes
        self.use_mock = not bool(OPENAI_API_KEY)
        
        if not self.use_mock:
            # Using gpt-4o-mini for cost-effective, high-quality reasoning
            self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
            self.parser = StrOutputParser()
            
            # --- 1. Translation Pipeline ---
            self.trans_template = """
            You are a medical localization expert for GE HealthCare. 
            Translate the following text from English to Finnish.
            
            Rules:
            1. Use professional medical terminology.
            2. Keep it concise (for embedded screens).
            3. Do not add explanations, just the translation.
            
            Text: {text}
            """
            self.trans_prompt = ChatPromptTemplate.from_template(self.trans_template)
            self.trans_chain = self.trans_prompt | self.llm | self.parser

            # --- 2. Explanation Pipeline (Context-Aware) ---
            self.explain_template = """
            You are the MediLingua System Architect. You are analyzing a medical software localization session.
            
            Current Analysis Data (JSON):
            {data}
            
            User Question: {question}
            
            Instructions:
            - Answer based ONLY on the provided data.
            - Explain WHY specific segments failed (mention specific pixel widths vs the 200px limit).
            - If a safety term (like "STOP") was used, mention it came from the Glossary.
            - Keep answers professional and brief.
            """
            self.explain_prompt = ChatPromptTemplate.from_template(self.explain_template)
            self.explain_chain = self.explain_prompt | self.llm | self.parser
            
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
            # Mock translation logic: Append [FI]
            return f"[FI] {text}"
        
        try:
            return await self.trans_chain.ainvoke({"text": text})
        except Exception as e:
            print(f"AI Error: {e}")
            return f"[ERR] {text}"

    async def explain(self, segments: List[Segment], question: str) -> str:
        """
        Analyzes the current state of segments to answer user questions.
        """
        if self.use_mock:
            return "I am running in simulation mode. Connect an OpenAI API Key to chat with your data contextually."

        # Serialize segments to simplified JSON for the LLM
        # We limit fields to save tokens and focus attention on the safety metrics
        context_data = json.dumps([
            {
                "id": s.id, 
                "source": s.source_text, 
                "target": s.target_text, 
                "width": s.width_px, 
                "status": s.status
            } 
            for s in segments
        ], indent=2)

        try:
            return await self.explain_chain.ainvoke({"data": context_data, "question": question})
        except Exception as e:
            return f"Error generating explanation: {str(e)}"

# Singleton
translator = AITranslator()