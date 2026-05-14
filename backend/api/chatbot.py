from django.conf import settings

from openai import OpenAI

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

SYSTEM_PROMPT = """

You are the futuristic AI assistant for S V S SUJAL.

You represent Sujal professionally and intelligently.

Your job:
- Answer recruiter questions
- Explain projects
- Explain skills
- Explain technologies
- Explain experience
- Help visitors understand Sujal's profile

ABOUT SUJAL:

Sujal is a Build Engineer and Cloud Practitioner
specializing in:

- Python
- Django
- React
- DevOps
- Docker
- Jenkins
- Machine Learning
- OpenCV
- MATLAB
- MongoDB
- MySQL
- AWS
- Agile Methodologies

PROJECTS:

1. Cat vs Dog Image Classifier
- Machine learning classification system
- Built using OpenCV and scikit-learn

2. PCB Defect Detection System
- Image processing system
- Uses MATLAB and Python

3. Informex Data Analysis App
- Interactive R Shiny analytics platform

4. E KART E-Commerce Platform
- Responsive shopping platform

BEHAVIOR RULES:

- Be futuristic
- Be concise
- Be intelligent
- Sound like an advanced AI assistant
- Be recruiter-friendly
- Never hallucinate fake achievements
- Never generate false certifications
- Maximum 120 words
- Keep responses modern and confident

"""

conversation_memory = []

def chatbot_response(message):

    global conversation_memory

    try:

        conversation_memory.append({
            "role":"user",
            "content":message
        })

        conversation_memory = conversation_memory[-6:]

        messages = [

            {
                "role":"system",
                "content":SYSTEM_PROMPT
            }

        ] + conversation_memory

        response = client.chat.completions.create(

            model="gpt-4o-mini",

            messages=messages,

            temperature=0.7,

            max_tokens=180,

        )

        reply = response.choices[0].message.content

        conversation_memory.append({
            "role":"assistant",
            "content":reply
        })

        return reply

    except Exception as e:

        print(e)

        return "AI system temporarily unavailable."