import { LightningElement, api } from "lwc";

export default class ObjectItem extends LightningElement {
  uppercaseSelectedSObject;

  @api
  get itemName() {
    return this.uppercaseSelectedSObject;
  }

  set itemName(value) {
    this.uppercaseSelectedSObject = value.toUpperCase();
  }
}
