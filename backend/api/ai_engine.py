import os
import time

from groq import Groq

from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)

# =========================
# LIGHTWEIGHT SYSTEM PROMPT
# =========================

SYSTEM_PROMPT = """

You are Sujal's AI portfolio assistant.

Answer briefly and professionally.

Topics:
- skills
- projects
- DevOps
- AI
- cloud
- contact
- resume

Skills:
Python, Django, React, Docker,
Jenkins, OpenCV, AWS, MongoDB.

Projects:
PCB Defect Detection,
Cat vs Dog Classifier,
Informex Analytics,
E KART E-Commerce.

Rules:
- max 60 words
- concise
- recruiter friendly
- no fake claims
- no long explanations

"""

# =========================
# MEMORY CACHE
# =========================

conversation_memory = {}

# =========================
# RATE LIMIT CACHE
# =========================

request_tracker = {}

# =========================
# GENERATE RESPONSE
# =========================

def generate_ai_response(
    message,
    session_id="default"
):

    try:

        current_time = time.time()

        # =========================
        # RATE LIMIT
        # =========================

        if session_id not in request_tracker:

            request_tracker[
                session_id
            ] = []

        request_tracker[
            session_id
        ] = [

            t for t in request_tracker[
                session_id
            ]

            if current_time - t < 60

        ]

        # MAX 10 REQUESTS / MINUTE

        if len(
            request_tracker[
                session_id
            ]
        ) >= 10:

            return (
                "⚠️ Rate limit exceeded. "
                "Please wait a minute."
            )

        request_tracker[
            session_id
        ].append(current_time)

        # =========================
        # MEMORY
        # =========================

        if session_id not in conversation_memory:

            conversation_memory[
                session_id
            ] = []

        memory = conversation_memory[
            session_id
        ]

        memory.append({

            "role": "user",

            "content": message[:200]

        })

        # KEEP ONLY LAST 4 MESSAGES

        memory = memory[-4:]

        conversation_memory[
            session_id
        ] = memory

        # =========================
        # GROQ REQUEST
        # =========================

        response = client.chat.completions.create(

            model=
            "llama-3.3-70b-versatile",

            messages=[

                {

                    "role": "system",

                    "content": SYSTEM_PROMPT

                }

            ] + memory,

            temperature=0.5,

            max_tokens=80,

        )

        reply = (

            response
            .choices[0]
            .message
            .content

        )

        # =========================
        # SAVE ASSISTANT MESSAGE
        # =========================

        memory.append({

            "role": "assistant",

            "content": reply[:300]

        })

        conversation_memory[
            session_id
        ] = memory[-4:]

        return reply

    except Exception as e:

        print(e)

        return (
            "⚠️ AI temporarily unavailable."
        )