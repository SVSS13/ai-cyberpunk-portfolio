import time
from .ai_engine import call_llm

SYSTEM_PROMPT = """
You are Sujal's futuristic AI portfolio assistant.

Your role:
- answer recruiter questions
- explain projects
- explain skills
- explain technologies
- explain experience
- guide visitors professionally

ABOUT SUJAL:
Skills: Python, Django, React, Docker, Jenkins, AWS, OpenCV, MongoDB, MySQL, Machine Learning.
Projects:
- PCB Defect Detection
- Cat vs Dog Classifier
- Informex Analytics
- E KART E-Commerce

Rules:
- concise responses
- maximum 80 words
- recruiter friendly
- modern tone
- no fake claims
- no hallucinations
"""

conversation_memory = {}
request_tracker = {}

def chatbot_response(message, session_id="default"):
    global conversation_memory
    global request_tracker

    try:
        current_time = time.time()
        if session_id not in request_tracker:
            request_tracker[session_id] = []

        request_tracker[session_id] = [
            t for t in request_tracker[session_id]
            if current_time - t < 60
        ]

        if len(request_tracker[session_id]) >= 10:
            return "⚠️ Rate limit exceeded. Please wait a minute."

        request_tracker[session_id].append(current_time)

        if session_id not in conversation_memory:
            conversation_memory[session_id] = []

        memory = conversation_memory[session_id]
        memory.append({"role": "user", "content": message[:250]})
        memory = memory[-4:]
        conversation_memory[session_id] = memory

        messages = [{"role": "system", "content": SYSTEM_PROMPT}] + memory
        reply = call_llm(messages, max_tokens=120, temperature=0.5)

        memory.append({"role": "assistant", "content": reply[:300]})
        conversation_memory[session_id] = memory[-4:]
        return reply

    except Exception as e:
        print(f"Chatbot error: {e}")
        return "⚠️ AI system temporarily unavailable."
