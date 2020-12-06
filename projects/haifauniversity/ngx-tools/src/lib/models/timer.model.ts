import { Subject, BehaviorSubject, timer } from 'rxjs';
import { map, tap, takeWhile, repeatWhen, share } from 'rxjs/operators';

export class UohTimer {
  private start$ = new Subject<void>();
  /**
   * Retrieves the current time of the timer.
   * Fires each second the countdown from the maximum time.
   * Stops when the timer is stopped and resets when it is started.
   */
  time$ = timer(0, 1000).pipe(
    map((time) => this.maxTime - time),
    tap((time) => (time < 0 ? this.stop() : undefined)),
    takeWhile((_) => this.active),
    repeatWhen((_) => this.start$),
    share()
  );
  private stopped = new BehaviorSubject<boolean>(true);
  stopped$ = this.stopped.asObservable();

  /**
   * Whether the timer is ticking or not.
   */
  get active(): boolean {
    return !this.stopped.getValue();
  }

  /**
   * Generates a new Timer that stops once the maximum time is reached.
   * @param maxTime The maximum time.
   */
  constructor(private maxTime: number) {}

  /**
   * Starts the timer.
   */
  start(): void {
    this.stopped.next(false);
    this.start$.next();
  }

  /**
   * Stops the timer.
   */
  stop(): void {
    this.stopped.next(true);
  }
}
