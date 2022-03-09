export function autoScroll(
  scrollable: (x: number, y: number, animated: boolean) => void,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  speedMultiplier = 1,
  cancellable: Cancellable = new Cancellable()
): Promise<boolean> {
  return new Promise((resolve) => {
    scrollable(fromX, fromY, false);
    const incrementPerMs = 7 * speedMultiplier;
    const directionMultiplerX = toX > fromX ? 1 : -1;
    const directionMultiplerY = toY > fromY ? 1 : -1;
    const comparatorX = toX > fromX ? Math.min : Math.max;
    const comparatorY = toY > fromY ? Math.min : Math.max;
    let startTime = Date.now();
    let startX = fromX;
    let startY = fromY;
    const animationLoop = () => {
      requestAnimationFrame(() => {
        if (cancellable.isCancelled()) {
          resolve(false);
          return;
        }
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime;
        const distanceToCover = incrementPerMs * timeElapsed;
        startX += distanceToCover * directionMultiplerX;
        startY += distanceToCover * directionMultiplerY;
        scrollable(comparatorX(toX, startX), comparatorY(toY, startY), false);
        startTime = currentTime;
        if (
          comparatorX(toX, startX) !== toX ||
          comparatorY(toY, startY) !== toY
        ) {
          return animationLoop();
        }
        resolve(true);
      });
    };
    animationLoop();
  });
}

export class Cancellable {
  public cancel() {
    this._isCancelled = true;
  }

  public isCancelled(): boolean {
    return this._isCancelled;
  }

  public _isCancelled: boolean = false;
}
