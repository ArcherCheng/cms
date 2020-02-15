export class ChildToggle {
  constructor(
    // tslint:disable-next-line: variable-name
    private _selectMarkID: string,
    // tslint:disable-next-line: variable-name
    private _selectTag: string,
    // tslint:disable-next-line: variable-name
    private _selectId: number
  ) {}

  set selectMarkID(selectMarkID: string) {
    this._selectMarkID = selectMarkID;
  }

  set selectTag(selectTag: string) {
    this._selectTag = selectTag;
  }

  set selectId(selectId: number) {
    this._selectId = selectId;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get selectMarkID(): string {
    return this._selectMarkID;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get selectTag(): string {
    return this._selectTag;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get selectId(): number {
    return this._selectId;
  }

  reset() {
    this._selectId = 0;
    this._selectTag = '';
  }

  setData(selectTag: string, selectId: number) {
    this._selectTag = selectTag;
    this._selectId = selectId;
  }
}
