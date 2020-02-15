export class ClickToggle {
  // tslint:disable-next-line: variable-name
  constructor(private _atrId: number, private _atrTagSel: string, private _atrTag: string[]) {}

  set atrId(atrId: number) {
    this._atrId = atrId;
  }

  set atrTagSel(atrTagSel: string) {
    this._atrTagSel = atrTagSel;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  set atrTag(atrTag: string[]) {
    this._atrTag = atrTag;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get atrId(): number {
    return this._atrId;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get atrTagSel(): string {
    return this._atrTagSel;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get atrTag(): string[] {
    return this._atrTag;
  }

  reset() {
    this._atrId = 0;
    this._atrTagSel = '';
  }
}
