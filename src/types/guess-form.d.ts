export interface GuessFormElements extends HTMLFormControlsCollection {
  lat: HTMLInputElement;
  lng: HTMLInputElement;
}

export interface GuessFormHTML extends HTMLFormElement {
  readonly elements: GuessFormElements;
}
