const INITIAL_TICK = 0;
const INITIAL_TPS = 60;

export class Ticker {
  private lastTime = performance.now();
  private running = false;
  private callback: ((deltaTime: number) => void) | null = null;

  private tick = INITIAL_TICK;
  private tps = INITIAL_TPS; // Ticks per seconds
  private paused = false;

  start() {
    if (this.running) return;
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
  }

  reset() {
    this.tick = INITIAL_TICK;
    this.lastTime = performance.now();
  }

  /**
 * Updates the state of the object.
 * @param deltaTime Time elapsed since last update, **in seconds**.
 */
  public on(callback: (deltaTime: number) => void) {
    this.callback = callback;
  }

  public setTPS(tps: number) {
    this.tps = tps;
  }

  public setPaused(paused: boolean) {
    this.paused = paused;
  }

  public getTick() {
    return this.tick;
  }

  private loop = () => {
    if (!this.running) return;

    const paused = this.paused;
    const tps = this.tps;
    if (!paused) {
      const interval = 1000 / tps;
      const now = performance.now();
      const dt = (now - this.lastTime) / 1000; // deltaTime en segundos

      if (dt >= interval / 1000) {
        this.lastTime = now;
        this.tick += 1;
        if (this.callback) {
          this.callback(dt);
        }
      }
    }

    requestAnimationFrame(this.loop);
  };
}