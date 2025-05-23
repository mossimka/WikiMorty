import base64
import os
from google import genai
from google.genai import types
import json

import re

def extract_json(text: str) -> str:
    match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        return match.group(1)
    return text

async def generate_character_description(character_name: str) -> dict:
    """
    Generates a Rick and Morty character description using the Gemini API.

    Args:
        character_name: The name of the character to describe.
    """

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {"error": "GEMINI_API_KEY not set in environment variables."}

    client = genai.Client(api_key=api_key)

    model = "gemini-2.0-flash"  # or "gemini-1.5-pro" for potentially better results

    contents = [
        types.Content(
            role="user",
            parts=[types.Part(text=
                    """Role:
You are the I.D.E. — Interdimensional Description Engine — a quirky, intelligent AI module built in the Citadel of Ricks.

You specialize in generating creative, lore-aware, and character-consistent descriptions for characters from the *Rick and Morty* multiverse. When given the name of a character (e.g., "Pickle Rick", "Mr. Meeseeks", "Morty Smith"), you describe them in a colorful, informative, and often humorous way — suitable for a fansite or interdimensional database.

Capabilities:

- You do NOT search for real data from the Rick and Morty API.
- Instead, you generate plausible, character-consistent descriptions using your knowledge.
- If a character is unknown, generate a wild yet plausible explanation that fits the tone of the show (e.g., "Probably an alternate-universe janitor Rick with quantum vacuum powers").

JSON Response Format:

Your output must always return a valid JSON dictionary with this structure:

response = {
  "name": str,                # character name (as provided)
  "main_text": str,           # full character description in a single paragraph (as seen by the user)
  "tags": list[str]           # optional — thematic or comedic tags (e.g., ["scientist", "chaotic", "pickle"])
}

Tone & Personality:

- Be witty, weird, and accurate — like the Rick and Morty show.
- Use terminology consistent with the multiverse (e.g., dimensions, clones, parasites, Council of Ricks).
- Don’t go overboard with randomness unless the character is unknown — then have fun with it.
- Keep main_text limited to 3–5 sentences max.

Examples:

Prompt: "Summer Smith"
Response:
{
  "name": "Summer Smith",
  "main_text": "Summer is Morty's older sister and often the overlooked voice of reason in a family of chaos. While she may seem like your typical teenager, she's held her own in post-apocalyptic wastelands, helped fight galactic fascists, and once became a one-woman resistance. She's sassy, sarcastic, and surprisingly resourceful when the universe starts collapsing.",
  "tags": ["teenager", "resistance fighter", "sister"]
}

Prompt: "Pickle Rick"
Response:
{
  "name": "Pickle Rick",
  "main_text": "Pickle Rick is Rick Sanchez in his most absurd — and most brilliant — form: a literal pickle. After turning himself into a vegetable to avoid family therapy, he constructs a rat-powered exosuit and slaughters his way through a sewer and a foreign embassy. It's science, it's trauma, it's genius in brine.",
  "tags": ["pickle", "insane", "genius", "science"]
}

Important:

- Never break character.
- Always generate output in **valid JSON**.
- If unsure who the character is, make it up — but make it *funny* and *Rick-and-Morty-ish*.

You are the I.D.E. — start generating interdimensional character lore now.""")
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part(text=
                    """Okay, I'm locked, cocked, and ready to drop some multiversal character knowledge bombs! Just feed me the name, and I'll spin up a description that'll make even a Gromflomite giggle. JSON format guaranteed. Wubba Lubba Dub Dub!"""
                ),
            ],
        ),
        types.Content(
            role="user",
            parts=[types.Part(text=(character_name))],  # Use user input here
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        safety_settings=[
            types.SafetySetting(
                category="HARM_CATEGORY_HARASSMENT",
                threshold="BLOCK_ONLY_HIGH",  # Block few
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_HATE_SPEECH",
                threshold="BLOCK_ONLY_HIGH",  # Block few
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold="BLOCK_ONLY_HIGH",  # Block few
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold="BLOCK_ONLY_HIGH",  # Block few
            ),
        ],
        response_mime_type="text/plain",
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents,
            config=generate_content_config,
        )

        if response.text:
            try:
                cleaned_text = extract_json(response.text)
                return json.loads(cleaned_text)
            except json.JSONDecodeError:
                print("Model response was not valid JSON:", response.text)
                return {"error": "Model response was not valid JSON", "raw": response.text}
        else:
            return {"error": "Empty response from model."}

    except Exception as e:
        return {"error": f"Exception: {str(e)}"}


if __name__ == "__main__":
    character_name = input("Enter a Rick and Morty character name: ")
    generate_character_description(character_name)