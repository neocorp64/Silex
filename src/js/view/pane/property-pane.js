//////////////////////////////////////////////////
// Silex, live web creation
// http://projects.silexlabs.org/?/silex/
//
// Copyright (c) 2012 Silex Labs
// http://www.silexlabs.org/
//
// Silex is available under the GPL license
// http://www.silexlabs.org/silex/silex-licensing/
//////////////////////////////////////////////////

/**
 * @fileoverview Property pane, displayed in the property tool box
 *
 */


goog.require('silex.view.pane.PaneBase');
goog.provide('silex.view.pane.PropertyPane');

goog.require('silex.utils.Dom');

goog.require('goog.array');
goog.require('goog.object');



/**
 * on of Silex Editors class
 * let user edit style of components
 * @constructor
 * @extend silex.view.PaneBase
 * @param {Element} element   container to render the UI
 * @param  {silex.types.View} view  view class which holds the other views
 * @param  {silex.types.Controller} controller  structure which holds the controller instances
 */
silex.view.pane.PropertyPane = function(element, view, controller) {
  // call super
  goog.base(this, element, view, controller);

  this.buildUi();
};

// inherit from silex.view.PaneBase
goog.inherits(silex.view.pane.PropertyPane, silex.view.pane.PaneBase);

/**
 * callback to call to let the user edit the image url
 */
silex.view.pane.PropertyPane.prototype.selectImage = null;


/**
 * UI for position and size
 */
silex.view.pane.PropertyPane.prototype.leftInput = null;


/**
 * UI for position and size
 */
silex.view.pane.PropertyPane.prototype.topInput = null;


/**
 * UI for position and size
 */
silex.view.pane.PropertyPane.prototype.widthInput = null;


/**
 * UI for position and size
 */
silex.view.pane.PropertyPane.prototype.heightInput = null;


/**
 * UI for alt and title
 * only used for images
 */
silex.view.pane.PropertyPane.prototype.altInput = null;


/**
 * UI for alt and title
 */
silex.view.pane.PropertyPane.prototype.titleInput = null;



/**
 * build the UI
 */
silex.view.pane.PropertyPane.prototype.buildUi = function() {

  // position and size
  this.leftInput = goog.dom.getElementByClass('left-input');
  this.leftInput.setAttribute('data-style-name', 'left');
  goog.events.listen(this.leftInput,
      goog.events.EventType.INPUT,
      this.onPositionChanged,
      false,
      this);
  this.widthInput = goog.dom.getElementByClass('width-input');
  this.widthInput.setAttribute('data-style-name', 'width');
  goog.events.listen(this.widthInput,
      goog.events.EventType.INPUT,
      this.onPositionChanged,
      false,
      this);
  this.topInput = goog.dom.getElementByClass('top-input');
  this.topInput.setAttribute('data-style-name', 'top');
  goog.events.listen(this.topInput,
      goog.events.EventType.INPUT,
      this.onPositionChanged,
      false,
      this);
  this.heightInput = goog.dom.getElementByClass('height-input');
  this.heightInput.setAttribute('data-style-name', 'height');
  goog.events.listen(this.heightInput,
      goog.events.EventType.INPUT,
      this.onPositionChanged,
      false,
      this);

  this.altInput = goog.dom.getElementByClass('alt-input');
  goog.events.listen(this.altInput,
      goog.events.EventType.INPUT,
      this.onAltChanged,
      false,
      this);
  this.titleInput = goog.dom.getElementByClass('title-input');
  goog.events.listen(this.titleInput,
      goog.events.EventType.INPUT,
      this.onTitleChanged,
      false,
      this);
};


/**
 * position or size changed
 * callback for number inputs
 */
silex.view.pane.PropertyPane.prototype.onPositionChanged =
    function(e) {
  // get the selected element
  var input = e.target;
  // the name of the property to change
  var name = input.getAttribute('data-style-name');
  // default is 0
  if (input.value === '') input.value = '0';
  // get the value
  var value = parseFloat(input.value);
  // get the old value
  var oldValue = parseFloat(input.getAttribute('data-prev-value') || 0);
  input.setAttribute('data-prev-value', value);
  // compute the offset
  var offset = value - oldValue;
  // the bounding box of all elements
  var bb = {};
  // apply the change to all elements
  goog.array.forEach(this.selectedElements, function (element) {
    if (goog.isNumber(value)){
      if (goog.isNumber(oldValue)){
        bb = silex.utils.Dom.getBoundingBox([element]);
        // compute the new value relatively to the old value,
        // in order to match the group movement
        var newValue = bb[name] + offset;
        this.styleChanged(name,
          newValue + 'px',
          [element]);
      }
      else{
        this.styleChanged(name, value + 'px');
      }
    }
    else{
      this.styleChanged(name);
    }
  }, this);
};


/**
 * alt changed
 * callback for inputs
 */
silex.view.pane.PropertyPane.prototype.onAltChanged =
    function(e) {
  // get the selected element
  var input = e.target;

  // apply the change to all elements
  if (input.value != ''){
    this.propertyChanged('alt', input.value, undefined, true);
  }
  else{
    this.propertyChanged('alt', undefined, undefined, true);
  }
};


/**
 * title changed
 * callback for inputs
 */
silex.view.pane.PropertyPane.prototype.onTitleChanged =
    function(e) {
  // get the selected element
  var input = e.target;

  // apply the change to all elements
  if (input.value != ''){
    this.propertyChanged('title', input.value);
  }
  else{
    this.propertyChanged('title');
  }
};


/**
 * redraw the properties
 * @param   {Array<element>} selectedElements the elements currently selected
 * @param   {HTMLDocument} document  the document to use
 * @param   {Array<string>} pageNames   the names of the pages which appear in the current HTML file
 * @param   {string}  currentPageName   the name of the current page
 */
silex.view.pane.PropertyPane.prototype.redraw = function(selectedElements, document, pageNames, currentPageName) {
  if (this.iAmSettingValue) return;
  this.iAmRedrawing = true;

  // call super
  goog.base(this, 'redraw', selectedElements, document, pageNames, currentPageName);

  // not available for stage element
  var elementsNoStage = [];
  goog.array.forEach(selectedElements, function (element) {
    if (document.body != element) {
      elementsNoStage.push(element);
    }
  }, this);
  if (elementsNoStage.length > 0) {
    // not stage element only
    this.leftInput.removeAttribute('disabled');
    this.topInput.removeAttribute('disabled');
    this.widthInput.removeAttribute('disabled');
    this.heightInput.removeAttribute('disabled');
    this.altInput.removeAttribute('disabled');
    this.titleInput.removeAttribute('disabled');

    // remember selection
    this.selectedElements = selectedElements;

    var bb = silex.utils.Dom.getBoundingBox(selectedElements);

    // display position and size
    this.topInput.value = bb.top || '';
    this.leftInput.value = bb.left || '';
    this.widthInput.value = bb.width || '';
    this.heightInput.value = bb.height || '';

    // special case of the background / main container only selected element
    if(selectedElements.length === 1 && goog.dom.classes.has(selectedElements[0], 'background')){
      this.topInput.value = '';
      this.leftInput.value = '';
    }

    // alt, only for images
    var elementsType = this.getCommonProperty(selectedElements, function (element) {
      return element.getAttribute(silex.model.Element.TYPE_ATTR);
    });
    if (elementsType === silex.model.Element.TYPE_IMAGE) {
      this.altInput.removeAttribute('disabled');
      var alt = this.getCommonProperty(selectedElements, function (element) {
        var content = goog.dom.getElementByClass(silex.model.Element.ELEMENT_CONTENT_CLASS_NAME, element);
        if (content) {
          return content.getAttribute('alt');
        }
        return null;
      });
      if (alt){
        this.altInput.value = alt;
      }
      else{
        this.altInput.value = '';
      }
    }
    else{
      this.altInput.value = '';
      this.altInput.setAttribute('disabled', true);
    }
    // title
    var title = this.getCommonProperty(selectedElements, function (element) {
      return element.getAttribute('title');
    });
    if (title){
      this.titleInput.value = title;
    }
    else{
      this.titleInput.value = '';
    }
  }
  else{
    // stage element only
    this.leftInput.setAttribute('disabled', true);
    this.leftInput.value = '';
    this.topInput.setAttribute('disabled', true);
    this.topInput.value = '';
    this.widthInput.setAttribute('disabled', true);
    this.widthInput.value = '';
    this.heightInput.setAttribute('disabled', true);
    this.heightInput.value = '';
    this.altInput.setAttribute('disabled', true);
    this.altInput.value = '';
    this.titleInput.setAttribute('disabled', true);
    this.titleInput.value = '';
  }
  // keep track of old position and size
  this.topInput.setAttribute('data-prev-value', this.topInput.value);
  this.leftInput.setAttribute('data-prev-value', this.leftInput.value);
  this.widthInput.setAttribute('data-prev-value', this.widthInput.value);
  this.heightInput.setAttribute('data-prev-value', this.heightInput.value);

  this.iAmRedrawing = false;
};
