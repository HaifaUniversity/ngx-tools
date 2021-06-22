import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

/**
 * Merger Function Interface
 */
export interface MergerFn<T> {
  (currState: T, newState: T | Partial<T> ): T
}

/**
 * Merge current state with new state using Object.assign function
 * @param currState current state
 * @param newState new state to merge with current state
 * @returns merged state+
 */
export const objectAssignMergerFn = <T>(currState: T, newState: Partial<T>) => Object.assign({}, currState, newState) as T;

/**
 * Override function that simply returns the new state
 * @param _ current state
 * @param newState new state to override
 * @returns newState
 */
export const overrideMergerFn = <T>(_: T, newState: T) => newState;

/**
 * Stores values to be used within a service or component.
 */
export class UohStore<T> {
  state$: Observable<T>;
  private store$: BehaviorSubject<T>;
  private initialState: T;

  /**
   * Generates a new store.
   * @param initialState The store initial state.
   * @param storageKey The key to use to store the data in the browser. If undefined, the data won't be stored in the browser storage.
   * @param storage The browser storage to use. Default: sessionStorage.
   */
  constructor(
    initialState: T,
    private storageKey?: string,
    private storage = sessionStorage,
    private mergerFn: MergerFn<T> = objectAssignMergerFn
  ) {
    this.initialState = this.storageKey
      ? this.getFromStorage(initialState, this.storageKey)
      : initialState;
    this.store$ = new BehaviorSubject<T>(this.initialState);
    this.state$ = this.store$.asObservable();
  }

  /**
   * Get the static value of the store's state.
   * @returns The static value of the store.
   */
  getState(): T {
    return this.store$.getValue();
  }

  /**
   * Get the static value of a specific object inside the store's state.
   * @param key A string representing a key in the state object.
   */
  getStateOf<K extends keyof T>(key: K): T[K] {
    return this.getState()[key];
  }

  /**
   * Override the state of the store with a partial static object
   * @param state A partial object containing updates for the state.
   */
  overrideState(state: T) {
    this.setState(state, overrideMergerFn as MergerFn<T>);
  }

  /**
   * Update the state of the store by passing a partial static object.
   * @param state A partial object containing updates for the state.
   */
  setState(state: Partial<T>, mergerFn: MergerFn<T> = this.mergerFn): void {
    // Use Object.assign to overcome an issue of typescript with the spread operator on generic types
    this.store$.next(mergerFn(this.getState(), state));
    this.save();
  }

  /**
   * Get the observable representation of an object in the state.
   * @param key A string representing a key in the state object.
   */
  select<K extends keyof T>(key: K): Observable<T[K]> {
    return this.state$.pipe(
      map((state) => state[key] as T[K]),
      distinctUntilChanged()
    );
  }

  /**
   * Resets this store by resetting the initial state.
   */
  reset(): void {
    this.store$.next(this.initialState);
    this.clear();
  }

  /**
   * Get the previously saved state in the session storage.
   * @param initialState The initial state for the store
   * @param key The storage key for the session storage
   */
  private getFromStorage(initialState: T, key: string): T {
    const value = this.storage.getItem(key);

    return value ? JSON.parse(value) : initialState;
  }

  /**
   * Save the current state in the session storage.
   */
  private save(): void {
    if (!!this.storageKey) {
      const state = this.getState();
      this.storage.setItem(this.storageKey, JSON.stringify(state));
    }
  }

  /**
   * Clears the current session storage.
   */
  private clear(): void {
    if (!!this.storageKey) {
      this.storage.removeItem(this.storageKey);
    }
  }
}
