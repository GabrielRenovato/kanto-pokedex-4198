import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

interface PokemonType {
  type: { name: string };
}

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      showdown?: {
        front_default?: string;
      };
    };
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
  stats: PokemonStat[];
  types: PokemonType[];
}

interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string };
}

interface PokemonSpecies {
  flavor_text_entries: FlavorTextEntry[];
}

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './_[id].html',
})
export default class PokemonidPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  readonly searchQuery = signal<string>('');
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  private readonly pokemonData$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id): id is string => id !== null && id.trim() !== ''),
    switchMap((id) => {
      this.loading.set(true);
      this.error.set(null);
      const query = id.toLowerCase().trim();

      return forkJoin({
        pokemon: this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${query}`).pipe(
          catchError(() => {
            this.error.set('Pokemon not found.');
            return of(null);
          })
        ),
        species: this.http
          .get<PokemonSpecies>(`https://pokeapi.co/api/v2/pokemon-species/${query}`)
          .pipe(catchError(() => of(null))),
      }).pipe(
        tap(() => {
          this.loading.set(false);
          this.searchQuery.set(''); // Clear search after successful load
        })
      );
    })
  );

  readonly data = toSignal(this.pokemonData$, { initialValue: { pokemon: null, species: null } });

  readonly pokemon = computed(() => this.data().pokemon);
  readonly species = computed(() => this.data().species);

  readonly spriteUrl = computed(() => {
    const p = this.pokemon();
    if (!p || !p.sprites) return '';

    if (p.sprites.other?.showdown?.front_default) {
      return p.sprites.other.showdown.front_default;
    }

    if (p.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default) {
      return p.sprites.versions['generation-v']['black-white'].animated.front_default;
    }

    return p.sprites.front_default || '';
  });

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/pokemon', query]);
    }
  }

  goNext(): void {
    const current = this.pokemon();
    if (current) {
      this.router.navigate(['/pokemon', current.id + 1]);
    }
  }

  goPrev(): void {
    const current = this.pokemon();
    if (current && current.id > 1) {
      this.router.navigate(['/pokemon', current.id - 1]);
    }
  }

  formatId(id: number | undefined): string {
    if (!id) return '000';
    return id.toString().padStart(3, '0');
  }

  getPrimaryType(): string {
    const p = this.pokemon();
    if (!p || !p.types || p.types.length === 0) return 'UNKNOWN';
    return p.types[0].type.name;
  }

  getStat(statName: string): number | string {
    const p = this.pokemon();
    if (!p || !p.stats) return '--';
    const stat = p.stats.find((s) => s.stat.name === statName);
    return stat ? stat.base_stat : '--';
  }

  getFlavorText(): string {
    const s = this.species();
    if (!s || !s.flavor_text_entries) return 'No data available.';
    const englishEntry = s.flavor_text_entries.find((entry) => entry.language.name === 'en');
    if (englishEntry) {
      // Clean up weird control characters from PokeAPI flavor text
      return englishEntry.flavor_text.replace(/[\n\f\r]/g, ' ');
    }
    return 'No English description available.';
  }
}
