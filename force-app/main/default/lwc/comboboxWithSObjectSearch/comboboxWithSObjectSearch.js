import { LightningElement, api, track, wire } from "lwc";
import getSObjectList from "@salesforce/apex/SObjectHelper.getSObjectListMap";

export default class ComboboxWithSObjectSearch extends LightningElement {
  // @api fieldLabel = "Select or search SObject from the dropdown list";
  @api disabled = false;
  @track openDropDown = false;
  @track inputValue = "";
  @api placeholder = "Click here to Select SObject";
  @api options;
  @track optionsToDisplay;
  @api value = "";
  @track label = "";
  delaytimeout;

  // get SObjects List<Map<String, String>> from Apex
  @wire(getSObjectList)
  SObjectList(result) {
    if (result.data) {
      this.options = result.data;
      this.error = undefined;
    } else if (result.error) {
      this.error = result.error;
    }
  }

  // lifecycle hook fires when a component is inserted into the DOM
  connectedCallback() {
    this.setOptionsAndValues();
  }

  // This hook flows from child to parent.
  // When a component renders, the expressions used in the template are reevaluated.
  renderedCallback() {
    if (this.openDropDown) {
      this.template.querySelector(".search-input-class").focus();
    }
  }

  // set options and values
  @api setOptionsAndValues() {
    this.optionsToDisplay =
      this.options && this.options.length > 0 ? this.options : [];
    if (this.value && this.value !== "") {
      let label = this.getLabel(this.value);
      if (label && label !== "") {
        this.label = label;
      }
    } else {
      this.label = "";
    }
  }

  // get Label for value provided
  getLabel(value) {
    let selectedObjArray = this.options.filter((obj) => obj.value === value);
    if (selectedObjArray && selectedObjArray.length > 0) {
      return selectedObjArray[0].label;
    }
    return null;
  }

  // open listbox dropdown
  openDropDown() {
    this.toggleOpenDropDown(true);
  }

  // close listbox dropdown
  closeDropdown(event) {
    if (
      event.relatedTarget &&
      event.relatedTarget.tagName === "UL" &&
      event.relatedTarget.className.includes("customClass")
    ) {
      if (this.openDropDown) {
        this.template
          .querySelectorAll(".search-input-class")
          .forEach((inputElem) => {
            inputElem.focus();
          });
      }
    } else {
      window.setTimeout(() => {
        this.toggleOpenDropDown(false);
      }, 300);
    }
  }

  // handle readonly input click
  handleInputClick() {
    this.resetParameters();
    this.toggleOpenDropDown(true);
  }

  // handle key press on text input
  handleKeyPress(event) {
    const searchKey = event.target.value;
    this.setInputValue(searchKey);
    if (this.delaytimeout) {
      window.clearTimeout(this.delaytimeout);
    }

    this.delaytimeout = setTimeout(() => {
      // filter dropdown list based on search key parameter
      this.filterDropdownList(searchKey);
    }, 350);
  }

  // filter dropdown list
  filterDropdownList(key) {
    const filteredOptions = this.options.filter((item) =>
      item.label.toLowerCase().includes(key.toLowerCase())
    );
    this.optionsToDisplay = filteredOptions;
  }

  // handle selected options in listbox
  optionsClickHandler(event) {
    const value = event.target.closest("li").dataset.value;
    const label = event.target.closest("li").dataset.label;
    this.setValues(value, label);
    this.toggleOpenDropDown(false);
    const detail = {};
    detail.value = value;
    detail.label = label;
    this.dispatchEvent(new CustomEvent("change", { detail: detail }));
  }

  // reset necessary properties
  resetParameters() {
    this.setInputValue("");
    this.optionsToDisplay = this.options;
  }

  // set inputValue for search input box
  setInputValue(value) {
    this.inputValue = value;
  }

  // set label and value based on the parameter provided
  setValues(value, label) {
    this.label = label;
    this.value = value;
  }

  // toggle openDropDown state
  toggleOpenDropDown(toggleState) {
    this.openDropDown = toggleState;
  }

  // getter-setter for dropDownClass
  get dropDownClass() {
    return this.openDropDown
      ? "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open"
      : "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
  }

  // getter-setter for isValueSelected
  get isValueSelected() {
    return this.label && this.label !== "" ? true : false;
  }

  get isDropdownOpen() {
    return this.openDropDown ? true : false;
  }
}
