import * as _moment from 'moment';
import { Moment } from 'moment';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

class Base {
  public static getGetters(): string[] {
    return Object.keys(this.prototype).filter(name => {
      return typeof Object.getOwnPropertyDescriptor(this.prototype, name).get === 'function';
    });
  }

  public static getSetters(): string[] {
    return Object.keys(this.prototype).filter(name => {
      return typeof Object.getOwnPropertyDescriptor(this.prototype, name).set === 'function';
    });
  }
}

export interface IValid {
  type: string;
  valid: boolean;
}

export class Search extends Base {
  private validObjs: IValid[] = [];

  constructor(
    // tslint:disable-next-line: variable-name
    private _id: number = 0,
    // tslint:disable-next-line: variable-name
    private _idSel: string = '',
    // tslint:disable-next-line: variable-name
    private _levelId: number = 0,
    // tslint:disable-next-line: variable-name
    private _levelIdSel: string = '',
    // tslint:disable-next-line: variable-name
    private _typeId: number = 0,
    // tslint:disable-next-line: variable-name
    private _typeIdSel: string = '',
    // tslint:disable-next-line: variable-name
    private _name: string = '',
    // tslint:disable-next-line: variable-name
    private _status: number = 0,
    // tslint:disable-next-line: variable-name
    private _statusSel: string = '',
    // tslint:disable-next-line: variable-name
    private _start: Moment = null,
    // tslint:disable-next-line: variable-name
    private _end: Moment = null,
    // tslint:disable-next-line: variable-name
    private _expand: string = '',
    // tslint:disable-next-line: variable-name
    private _embed: string = '',
    // tslint:disable-next-line: variable-name
    private _check: boolean = true
  ) {
    super();
  }

  set id(value) {
    this._id = value;
  }

  set idSel(value) {
    this._idSel = value;
  }

  set levelId(value) {
    this._levelId = value;
  }

  set levelIdSel(value) {
    this._levelIdSel = value;
  }

  set typeId(value) {
    this._typeId = value;
  }

  set typeIdSel(value) {
    this._typeIdSel = value;
  }

  set name(value) {
    this._name = value;
  }

  set status(value) {
    this._status = value;
  }

  set statusSel(value) {
    this._statusSel = value;
  }

  set start(value) {
    this._start = value;
  }

  set end(value) {
    this._end = value;
  }

  set expand(value) {
    this._expand = value;
  }

  set embed(value) {
    this._embed = value;
  }

  set check(value) {
    this._check = value;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get id(): number {
    return this._id;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get idSel(): string {
    return this._idSel;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get levelId(): number {
    return this._levelId;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get levelIdSel(): string {
    return this._levelIdSel;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get typeId(): number {
    return this._typeId;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get typeIdSel(): string {
    return this._typeIdSel;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get name(): string {
    return this._name;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get status(): number {
    return this._status;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get statusSel(): string {
    return this._statusSel;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get expand(): string {
    return this._expand;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get embed(): string {
    return this._embed;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get check(): boolean {
    return this._check;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get start(): Moment {
    return this._start;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  get end(): Moment {
    return this._end;
  }

  setValidObjs(obj: IValid) {
    const index = this.validObjs
      .map((validObj: IValid) => {
        return validObj.type;
      })
      .indexOf(obj.type);
    if (index === -1) {
      this.validObjs.push(obj);
    } else {
      this.validObjs[index] = obj;
    }
    this.setCheck();
  }

  setCheck() {
    this._check = true;
    this.validObjs.forEach((validObj: IValid) => {
      if (!validObj.valid) {
        this._check = false;
        return;
      }
    });
  }

  getSearch(): Search {
    const obj =  {} as Search;

    if (!!this._id) {
      obj.id = this._id;
    }
    if (!!this._idSel) {
      obj.id = +this._idSel;
    }
    if (!!this._levelId) {
      obj.levelId = this._levelId;
    }
    if (!!this._levelIdSel) {
      obj.levelId = +this._levelIdSel;
    }
    if (!!this._typeId) {
      obj.typeId = this._typeId;
    }
    if (!!this._typeIdSel) {
      obj.typeId = +this._typeIdSel;
    }
    if (!!this._name) {
      obj.name = this._name;
    }
    if (!!this._status) {
      obj.status = this._status;
    }
    if (!!this._statusSel) {
      obj.status = +this._statusSel;
    }
    if (!!this._start) {
      // tslint:disable-next-line: no-string-literal
      obj['inserted_gte'] = this._start.valueOf();
    }
    if (!!this._end) {
      // tslint:disable-next-line: no-string-literal
      obj['inserted_lte'] = this._end.valueOf();
    }

    return obj;
  }

  setSearchDate(indexDateTab: string) {
    switch (indexDateTab) {
      case 'now':
        this._start = moment().subtract(1, 'hours');
        this._end = moment()
          .startOf('date')
          .add(1, 'days');
        break;
      case 'today':
        this._start = moment().startOf('date');
        this._end = moment()
          .startOf('date')
          .add(1, 'days');
        break;
      case 'yesterday':
        this._start = moment()
          .startOf('date')
          .subtract(1, 'days');
        this._end = moment().startOf('date');
        break;
      case 'month':
        this._start = moment().startOf('month');
        this._end = moment()
          .startOf('month')
          .add(1, 'months');
        break;
    }
  }
}
