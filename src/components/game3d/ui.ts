export class UI {
  constructor(
    private game: { restart(): void },
    private refs: {
      scoreEl: HTMLElement;
      timerEl: HTMLElement;
      gameOverEl: HTMLElement;
      finalScoreEl: HTMLElement;
      restartBtn: HTMLButtonElement;
    }
  ) {
    this.refs.restartBtn.addEventListener("click", () => this.game.restart());
  }

  updateScore(score: number) {
    this.refs.scoreEl.textContent = String(score);
  }

  updateTimer(timeLeft: number) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    this.refs.timerEl.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  showGameOver(finalScore: number) {
    this.refs.finalScoreEl.textContent = String(finalScore);
    this.refs.gameOverEl.style.display = "block";
  }

  hideGameOver() {
    this.refs.gameOverEl.style.display = "none";
  }
}


