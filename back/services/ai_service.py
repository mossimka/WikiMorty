'''import google.generativeai as genai
import json
from config.settings import settings

SYSTEM_INSTRUCTIONS_CHARACTER = """Role:
You are an expert storyteller and character analyst specializing in the universe of [Your Universe, e.g., Rick and Morty].
You provide concise yet insightful descriptions of characters when given their name.

Capabilities:
Generate a detailed description focusing on personality, key background information, common behaviors, and notable traits for a given character name.
Keep the description focused and engaging.

Output Format:
Generate a JSON response strictly following this schema:
{'description': str}

Where 'description' contains the generated text about the character. Do not include any other fields or introductory text outside the JSON structure.
"""

async def generate_character_description(character_name: str):
    if not character_name:
        raise ValueError("Character name cannot be empty")

    # Настройка API-ключа
    genai.configure(api_key=settings.GEMINI_API_KEY.get_secret_value())

    # Создаём модель
    model = genai.GenerativeModel(
        model_name="models/gemini-1.5-flash-latest",
        system_instruction=SYSTEM_INSTRUCTIONS_CHARACTER
    )

    prompt = f"Provide a description for the character named '{character_name}' from [Your Universe, e.g., Rick and Morty]."

    # Так как generate_content синхронный метод, нужно его вызывать через to_thread
    import asyncio
    response = await asyncio.to_thread(model.generate_content, prompt)

    # Достаём текст
    response_text = response.text
    print(f"AI Raw Response Text (Simplified): {response_text}")

    # Парсим JSON
    ai_data = json.loads(response_text)

    return ai_data'''
