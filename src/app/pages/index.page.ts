import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    versions?: {
      'generation-v'?: {
        'black-white'?: {
          animated?: {
            front_default?: string;
          };
        };
      };
    };
  };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

interface Species {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './_index.html',
})
export default class IndexPage implements OnInit {
  private readonly http = inject(HttpClient);

  readonly currentId = signal<number>(25); // Start with Pikachu
  readonly searchInput = signal<string>('');

  readonly pokemon = signal<Pokemon | null>(null);
  readonly description = signal<string>('');
  readonly loading = signal<boolean>(false);
  readonly error = signal<boolean>(false);

  readonly spriteUrl = computed(() => {
    const p = this.pokemon();
    if (!p) return '';
    return (
      p.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
      p.sprites?.front_default ||
      ''
    );
  });

  ngOnInit() {
    this.loadPokemon(this.currentId());
  }

  async loadPokemon(identifier: string | number) {
    if (!identifier) return;

    this.loading.set(true);
    this.error.set(false);

    try {
      const pData = await firstValueFrom(
        this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${identifier}`)
      );
      this.pokemon.set(pData);
      this.currentId.set(pData.id);

      const sData = await firstValueFrom(
        this.http.get<Species>(`https://pokeapi.co/api/v2/pokemon-species/${pData.id}`)
      );

      const englishEntry = sData.flavor_text_entries.find((e) => e.language.name === 'en');
      if (englishEntry) {
        // Clean up weird characters from PokeAPI flavor text
        const cleanText = englishEntry.flavor_text.replace(/[\n\f\r]/g, ' ');
        this.description.set(cleanText);
      } else {
        this.description.set('NO DATA AVAILABLE.');
      }
    } catch (e) {
      this.error.set(true);
      this.pokemon.set(null);
      this.description.set('');
    } finally {
      this.loading.set(false);
      this.searchInput.set(''); // Clear input after search
    }
  }

  handleSearch() {
    const query = this.searchInput().trim().toLowerCase();
    if (query) {
      this.loadPokemon(query);
    }
  }

  next() {
    if (!this.loading()) {
      this.loadPokemon(this.currentId() + 1);
    }
  }

  prev() {
    if (!this.loading() && this.currentId() > 1) {
      this.loadPokemon(this.currentId() - 1);
    }
  }

  getStat(name: string): number {
    const p = this.pokemon();
    if (!p) return 0;
    const stat = p.stats.find((s) => s.stat.name === name);
    return stat ? stat.base_stat : 0;
  }

  formatId(id: number | undefined): string {
    if (!id) return '000';
    return id.toString().padStart(3, '0');
  }
}
