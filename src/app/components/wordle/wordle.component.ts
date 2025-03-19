import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wordle',
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

  getTileClass(rowIndex: number, tileIndex: number): any {
    if (!this.rowsSubmitted[rowIndex]) {
      return {}; // No aplica colores si la fila no ha sido enviada
    }
  
    const letter = this.guesses[rowIndex][tileIndex];
  
    if (this.word[tileIndex] === letter) {
      return { 'correct': true };
    } else if (this.word.includes(letter)) {
      return { 'present': true };
    } else {
      return { 'absent': true };
    }
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
 
  submitGuess(): void {
    if (this.currentTile !== 6) return;
  
    const guess = this.guesses[this.currentRow].join('');
    guess.split('').forEach((letter, i) => {
      if (this.word[i] === letter) {
        this.letterColors[`${this.currentRow}-${i}`] = 'green';
      } else if (this.word.includes(letter)) {
        this.letterColors[`${this.currentRow}-${i}`] = 'orange';
      } else {
        this.letterColors[`${this.currentRow}-${i}`] = 'red';
      }
    });
  
    // Marca la fila como enviada
    this.rowsSubmitted[this.currentRow] = true;
  
    if (guess === this.word) {
      alert('🎉 ¡Ganaste! 🎉');
      this.gameOver = true;
    } else if (this.currentRow >= 5) {
      alert('Perdiste. La palabra era: ' + this.word);
      this.gameOver = true;
    } else {
      this.currentRow++;
      this.currentTile = 0;
    }
  }
  
}
