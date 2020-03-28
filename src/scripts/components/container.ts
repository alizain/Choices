import { wrap, addClasses, removeClasses } from '../lib/utils';
import { SELECT_ONE_TYPE } from '../constants';
import { PassedElement, ClassNames, Options } from '../interfaces';

export default class Container {
  element: HTMLElement;
  type: PassedElement['type'];
  classNames: ClassNames;
  position: Options['position'];
  isOpen: boolean;
  isFlipped: boolean;
  isFocussed: boolean;
  isDisabled: boolean;
  isLoading: boolean;

  constructor({
    element,
    type,
    classNames,
    position,
  }: {
    element: HTMLElement;
    type: PassedElement['type'];
    classNames: ClassNames;
    position: Options['position'];
  }) {
    this.element = element;
    this.classNames = classNames;
    this.type = type;
    this.position = position;
    this.isOpen = false;
    this.isFlipped = false;
    this.isFocussed = false;
    this.isDisabled = false;
    this.isLoading = false;
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  addEventListeners(): void {
    this.element.addEventListener('focus', this._onFocus);
    this.element.addEventListener('blur', this._onBlur);
  }

  removeEventListeners(): void {
    this.element.removeEventListener('focus', this._onFocus);
    this.element.removeEventListener('blur', this._onBlur);
  }

  /**
   * Determine whether container should be flipped based on passed
   * dropdown position
   */
  shouldFlip(dropdownPos: number): boolean {
    if (typeof dropdownPos !== 'number') {
      return false;
    }

    // If flip is enabled and the dropdown bottom position is
    // greater than the window height flip the dropdown.
    let shouldFlip = false;
    if (this.position === 'auto') {
      shouldFlip = !window.matchMedia(`(min-height: ${dropdownPos + 1}px)`)
        .matches;
    } else if (this.position === 'top') {
      shouldFlip = true;
    }

    return shouldFlip;
  }

  setActiveDescendant(activeDescendantID: string): void {
    this.element.setAttribute('aria-activedescendant', activeDescendantID);
  }

  removeActiveDescendant(): void {
    this.element.removeAttribute('aria-activedescendant');
  }

  open(dropdownPos: number): void {
    addClasses(this.element, this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'true');
    this.isOpen = true;

    if (this.shouldFlip(dropdownPos)) {
      addClasses(this.element, this.classNames.flippedState);
      this.isFlipped = true;
    }
  }

  close(): void {
    removeClasses(this.element, this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'false');
    this.removeActiveDescendant();
    this.isOpen = false;

    // A dropdown flips if it does not have space within the page
    if (this.isFlipped) {
      removeClasses(this.element, this.classNames.flippedState);
      this.isFlipped = false;
    }
  }

  focus(): void {
    if (!this.isFocussed) {
      this.element.focus();
    }
  }

  addFocusState(): void {
    addClasses(this.element, this.classNames.focusState);
  }

  removeFocusState(): void {
    removeClasses(this.element, this.classNames.focusState);
  }

  enable(): void {
    removeClasses(this.element, this.classNames.disabledState);
    this.element.removeAttribute('aria-disabled');
    if (this.type === SELECT_ONE_TYPE) {
      this.element.setAttribute('tabindex', '0');
    }
    this.isDisabled = false;
  }

  disable(): void {
    addClasses(this.element, this.classNames.disabledState);
    this.element.setAttribute('aria-disabled', 'true');
    if (this.type === SELECT_ONE_TYPE) {
      this.element.setAttribute('tabindex', '-1');
    }
    this.isDisabled = true;
  }

  wrap(element: HTMLSelectElement | HTMLInputElement | HTMLElement): void {
    wrap(element, this.element);
  }

  unwrap(element: HTMLElement): void {
    if (this.element.parentNode) {
      // Move passed element outside this element
      this.element.parentNode.insertBefore(element, this.element);
      // Remove this element
      this.element.parentNode.removeChild(this.element);
    }
  }

  addLoadingState(): void {
    addClasses(this.element, this.classNames.loadingState);
    this.element.setAttribute('aria-busy', 'true');
    this.isLoading = true;
  }

  removeLoadingState(): void {
    removeClasses(this.element, this.classNames.loadingState);
    this.element.removeAttribute('aria-busy');
    this.isLoading = false;
  }

  _onFocus(): void {
    this.isFocussed = true;
  }

  _onBlur(): void {
    this.isFocussed = false;
  }
}
