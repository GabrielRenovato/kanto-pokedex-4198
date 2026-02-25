# kanto-pokedex-4198

## 🎯 Project Objective
Act as a Senior Frontend Developer and UI Designer specializing in Skeuomorphism. I need you to build a fully functional web-based Pokedex that looks exactly like the physical device from the anime (Model: Kanto Pokedex, red casing).

Requirements:
Visuals (Skeuomorphic Design):
- Use pure CSS to create the red plastic casing, shadows, and physical-looking buttons (D-pad, blue glassy buttons, circular yellow LEDs).
- The main screen should look like a retro LCD display (greenish or blue tint, scanlines are a plus).
- Layout should be responsive but maintain the device's aspect ratio.

Functionality (Real Features):
- Integrate with PokeAPI (pokeapi.co) to fetch real Pokemon data.
- Search System: Implement a way to input a Pokemon name or ID.
- Navigation: The D-Pad buttons on the UI must be clickable and actually navigate to the next/previous Pokemon.
- Data Display: Show the 3D render sprite (falling back to static if unavailable), name, ID, types, and base stats on the screen.
- Flavor Text: Fetch the 'flavor text' entry and display it.

Tech Stack:
- AnalogJS v1.0 + Angular 18+
- Tailwind CSS 3
- Standalone Components, Signals, Control Flow (@if, @for)

## 🧠 Project Memory (Context for the AI)
This file serves as the central memory of the project. **Whenever you (AI) add a new route, service, or change the main architecture, you MUST update this file.**

### 🛠️ Tech Stack
- Framework: AnalogJS v1.0 + Angular 18+
- Backend: API Routes (h3) + Prisma ORM (SQLite)
- Routing: File-based routing (src/app/pages)
- Styling: Tailwind CSS 3
- Architecture: Standalone Components, Signals, Control Flow (@if, @for)

### 📂 Current Pages and Routes
- `index`
- `pokemon/[id]`

### 📝 Project Rules
- Components must use `export default class`.
- HTML must NEVER be mixed in TypeScript.
- All template variables must be declared in the .ts file.