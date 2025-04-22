import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.css']
})
export class WordleComponent implements OnInit {
  guesses: string[][] = Array.from({ length: 6 }, () => Array(6).fill(''));
  currentRow: number = 0;
  currentTile: number = 0;
  word: string = '';
  gameOver: boolean = false;
  keyboard: string[] = 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split('');
  letterColors: { [key: string]: string } = {};
  rowsSubmitted: boolean[] = Array(6).fill(false);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadWordOfTheDay();
  }

  loadWordOfTheDay(): void {
    this.http.get<string[]>('/ingredientes.json').subscribe(words => {
      const date = new Date().toLocaleDateString();
      const randomIndex = Math.floor(this.seededRandom(date) * words.length);
      this.word = words[randomIndex].toUpperCase();
      console.log('Palabra del día:', this.word);
    });
  }

  seededRandom(seed: string): number {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    return Math.abs((h & 0xffffff) / 0xffffff);
  }

  @HostListener('window:keydown', ['$event'])
  handlePhysicalKeyboard(event: KeyboardEvent): void {
    this.handleKey(event.key);
  }

  handleKey(key: string): void {
    if (this.gameOver) return;

    const upperKey = key.toUpperCase();
    if (upperKey === 'BACKSPACE') {
      if (this.currentTile > 0) {
        this.currentTile--;
        this.guesses[this.currentRow][this.currentTile] = '';
      }
    } else if (upperKey === 'ENTER') {
      this.submitGuess();
    } else if (/^[A-ZÑ]$/.test(upperKey)) {
      if (this.currentTile < 6) {
        this.guesses[this.currentRow][this.currentTile] = upperKey;
        this.currentTile++;
      }
    }
  }

  getTileClass(rowIndex: number, tileIndex: number): any {
    if (!this.rowsSubmitted[rowIndex]) return {};

    const key = `${rowIndex}-${tileIndex}`;
    const color = this.letterColors[key];

    return {
      correct: color === 'correct',
      present: color === 'present',
      absent: color === 'absent'
    };
  }

  submitGuess(): void {
    if (this.currentTile !== 6) return;

    const guess = this.guesses[this.currentRow].join('');
    const solutionArray = this.word.split('');
    const guessArray = guess.split('');

    const tileColors: ('correct' | 'present' | 'absent')[] = Array(6).fill('absent');
    const solutionLetterCounts: { [letter: string]: number } = {};

    // Paso 1: contar letras de la solución
    for (const letter of solutionArray) {
      solutionLetterCounts[letter] = (solutionLetterCounts[letter] || 0) + 1;
    }

    // Paso 2: marcar letras correctas
    for (let i = 0; i < 6; i++) {
      if (guessArray[i] === solutionArray[i]) {
        tileColors[i] = 'correct';
        solutionLetterCounts[guessArray[i]]--;
      }
    }

    // Paso 3: marcar letras presentes
    for (let i = 0; i < 6; i++) {
      const letter = guessArray[i];
      if (tileColors[i] !== 'correct' && solutionLetterCounts[letter] > 0) {
        tileColors[i] = 'present';
        solutionLetterCounts[letter]--;
      }
    }

    // Paso 4: aplicar colores a casillas y teclado
    for (let i = 0; i < 6; i++) {
      const letter = guessArray[i];
      const key = `${this.currentRow}-${i}`;
      const color = tileColors[i];
      this.letterColors[key] = color;

      const current = this.letterColors[letter];
      if (
        current !== 'correct' &&
        (color === 'correct' || (color === 'present' && current !== 'present'))
      ) {
        this.letterColors[letter] = color;
      } else if (!current) {
        this.letterColors[letter] = color;
      }
    }

    this.rowsSubmitted[this.currentRow] = true;

    if (guess === this.word) {
      alert('🎉 ¡Ganaste! 🎉');
      this.gameOver = true;
    } else if (this.currentRow >= 5) {
      alert('❌ Perdiste. La palabra era: ' + this.word);
      this.gameOver = true;
    } else {
      this.currentRow++;
      this.currentTile = 0;
    }
  }
}
