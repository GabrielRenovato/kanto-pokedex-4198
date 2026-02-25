# kanto-pokedex-4198

## 🎯 Project Objective
Act as a Senior Frontend Developer and UI Designer specializing in Skeuomorphism. I need you to build a fully functional web-based Pokedex that looks exactly like the physical device from the anime (Model: Kanto Pokedex, red casing).

Requirements:
Visuals (Skeuomorphic Design):

Use pure CSS to create the red plastic casing, shadows, and physical-looking buttons (D-pad, blue glassy buttons, circular yellow LEDs).

The main screen should look like a retro LCD display (greenish or blue tint, scanlines are a plus).

Layout should be responsive but maintain the device's aspect ratio.

Functionality (Real Features):

Integrate with PokeAPI (pokeapi.co) to fetch real Pokemon data.

Search System: Implement a way to input a Pokemon name or ID.

Navigation: The D-Pad buttons on the UI must be clickable and actually navigate to the next/previous Pokemon.
Data Display: Show the 3D render sprite (falling back to static if unavailable), name, ID, types, and base stats on the screen.

Flavor Text: Fetch the 'flavor text' entry and display it.

Tech Stack:

Use HTML5, CSS3, and Vanilla JavaScript (or Angular/Tailwind if you prefer, please specify).

No external heavy frameworks unless necessary.

Please provide the complete code in a single file or separated blocks clearly.

## 🧠 Project Memory (Contexto para a IA)
Este arquivo serve como a memória central do projeto. **Sempre que você (IA) adicionar uma nova rota, serviço ou alterar a arquitetura principal, você DEVE atualizar este arquivo.**

### 🛠️ Stack Tecnológica
- Framework: AnalogJS v1.0 + Angular 18+
- Backend: API Routes (h3) + Prisma ORM (SQLite)
- Roteamento: File-based routing (src/app/pages)
- Estilização: Tailwind CSS 3
- Arquitetura: Standalone Components, Signals, Control Flow (@if, @for)

### 📂 Páginas e Rotas Atuais
- `index`
- `pokemon/[id]`

### 📝 Regras do Projeto
- Componentes devem usar `export default class`.
- O HTML NUNCA deve ser misturado no TypeScript.
- Todas as variáveis do template devem ser declaradas no .ts.