import { PassedElement, ClassNames } from '../interfaces';
import { addClasses, removeClasses } from '../lib/utils';

export default class Dropdown {
  element: HTMLElement;
  type: PassedElement['type'];
  classNames: ClassNames;
  isActive: boolean;

  constructor({
    element,
    type,
    classNames,
  }: {
    element: HTMLElement;
    type: PassedElement['type'];
    classNames: ClassNames;
  }) {
    this.element = element;
    this.classNames = classNames;
    this.type = type;
    this.isActive = false;
  }

  /**
   * Bottom position of dropdown in viewport coordinates
   */
  get distanceFromTopWindow(): number {
    return this.element.getBoundingClientRect().bottom;
  }

  getChild(selector: string): HTMLElement | null {
    return this.element.querySelector(selector);
  }

  /**
   * Show dropdown to user by adding active state class
   */
  show(): this {
    addClasses(this.element, this.classNames.activeState);
    this.element.setAttribute('aria-expanded', 'true');
    this.isActive = true;

    return this;
  }

  /**
   * Hide dropdown from user
   */
  hide(): this {
    removeClasses(this.element, this.classNames.activeState);
    this.element.setAttribute('aria-expanded', 'false');
    this.isActive = false;

    return this;
  }
}
