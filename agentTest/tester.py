import asyncio
from dotenv import load_dotenv

from browser_use import Agent, ChatGoogle

load_dotenv()

async def main():
    llm = ChatGoogle(
        model="gemini-3.1-flash-lite", 
        temperature=0.0
    )

    task_description = """
    Jesteś testerem manualnym. Testujesz aplikację na http://localhost:3000.
    
    Kroki do wykonania dokładnie w tej kolejności:
    1. Wejdź na http://localhost:3000.
    2. Spróbuj kliknąć w plakat filmu "Swapped". JEŚLI NIE WIDZISZ NUMERU INDEKSU na plakacie, po prostu przejdź bezpośrednio pod adres: http://localhost:3000/movie/1007757
    3. Na stronie filmu kliknij w przycisk zawierający tekst "DO_OBEJRZENIA".
    4. Pojawi się okienko o braku dostępu. Kliknij przycisk "ZROZUMIANO", aby je zamknąć.
    5. Po zamknięciu okienka, kliknij w górnym menu przycisk "[ ZALOGUJ ]".
    6. Na stronie logowania wpisz dowolny email i hasło w pola formularza, a następnie kliknij "Zaloguj".
    7. Zakończ test i napisz raport.
    """

    agent = Agent(
        task=task_description,
        llm=llm,
    )

    original_step = agent.step
    
    async def rate_limited_step(*args, **kwargs):
        print("\n⏳ Hamulec anty-limitowy: Czekam 15 sekund przed kolejną akcją...")
        await asyncio.sleep(15)
        return await original_step(*args, **kwargs)
        
    agent.step = rate_limited_step

    print("Uruchamiam agenta Gemini... (Otworzy się okno przeglądarki)")
    result = await agent.run()
    
    print("\n--- RAPORT Z TESTU ---")
    print(result)

if __name__ == "__main__":
    asyncio.run(main())