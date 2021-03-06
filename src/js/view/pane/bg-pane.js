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
 * @fileoverview Property pane, displayed in the property tool box.
 * Controls the background params
 *
 */


goog.require('silex.view.pane.PaneBase');
goog.provide('silex.view.pane.BgPane');

goog.require('silex.utils.Style');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.ColorButton');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.HsvaPalette');
goog.require('goog.ui.TabBar');



/**
 * on of Silex Editors class
 * let user edit style of components
 * @constructor
 * @extend silex.view.PaneBase
 * @param {Element} element   container to render the UI
 * @param  {Element} bodyElement  HTML element which holds the body section of the opened file
 * @param  {silex.types.View} view  view class which holds the other views
 * @param  {silex.types.Controller} controller  structure which holds the controller instances
 */
silex.view.pane.BgPane = function(element, view, controller) {
  // call super
  goog.base(this, element, view, controller);

  this.buildUi();
};

// inherit from silex.view.PaneBase
goog.inherits(silex.view.pane.BgPane, silex.view.pane.PaneBase);


/**
 * build the UI
 */
silex.view.pane.BgPane.prototype.buildUi = function() {
  // BG color
  var hsvPaletteElement = goog.dom.getElementByClass('color-bg-palette',
                                                     this.element);
  this.hsvPalette = new goog.ui.HsvaPalette(null,
                                            null,
                                            null,
                                            'goog-hsva-palette-sm');
  this.hsvPalette.render(hsvPaletteElement);

  // init button which shows/hides the palete
  this.bgColorPicker = new goog.ui.ColorButton();
  this.bgColorPicker.setTooltip('Click to select color');
  this.bgColorPicker.render(goog.dom.getElementByClass('color-bg-button'));
  // init palette
  this.hsvPalette.setColorRgbaHex('#FFFFFFFF');
  this.setColorPaletteVisibility(false);

  // init the button to choose if there is a color or not
  this.transparentBgCheckbox = new goog.ui.Checkbox();
  this.transparentBgCheckbox.decorate(
      goog.dom.getElementByClass('enable-color-bg-button'), this.element
  );

  // add bg image
  var buttonAddImage = goog.dom.getElementByClass('bg-image-button');
  this.bgSelectBgImage = new goog.ui.CustomButton();
  this.bgSelectBgImage.decorate(buttonAddImage);
  this.bgSelectBgImage.setTooltip('Click to select a file');
  // remove bg image
  var buttonClearImage = goog.dom.getElementByClass('clear-bg-image-button');
  this.bgClearBgImage = new goog.ui.CustomButton();
  this.bgClearBgImage.setTooltip('Click to select a file');
  this.bgClearBgImage.decorate(buttonClearImage);

  // bg image properties
  this.attachmentComboBox = goog.ui.decorate(
      goog.dom.getElementByClass('bg-attachment-combo-box')
      );
  this.vPositionComboBox = goog.ui.decorate(
      goog.dom.getElementByClass('bg-position-v-combo-box')
      );
  this.hPositionComboBox = goog.ui.decorate(
      goog.dom.getElementByClass('bg-position-h-combo-box')
      );
  this.repeatComboBox = goog.ui.decorate(
      goog.dom.getElementByClass('bg-repeat-combo-box')
      );
  this.sizeComboBox = goog.ui.decorate(
      goog.dom.getElementByClass('bg-size-combo-box')
      );
  // User has selected a color
  goog.events.listen(this.hsvPalette,
                     goog.ui.Component.EventType.ACTION,
                     this.onColorChanged,
                     false,
                     this);
  // the user opens/closes the palete
  goog.events.listen(this.bgColorPicker,
                     goog.ui.Component.EventType.ACTION,
                     this.onBgColorButton,
                     false,
                     this);
  // user set transparent bg
  goog.events.listen(this.transparentBgCheckbox,
                     goog.ui.Component.EventType.CHANGE,
                     this.onTransparentChanged,
                     false,
                     this);
  // user wants to select a bg image
  goog.events.listen(buttonAddImage,
      goog.events.EventType.CLICK,
      this.onSelectImageButton,
      false,
      this);

  goog.events.listen(buttonClearImage,
      goog.events.EventType.CLICK,
      this.onClearImageButton,
      false,
      this);
  goog.events.listen(this.attachmentComboBox,
      goog.ui.Component.EventType.CHANGE,
      function(event) {
        if (this.iAmRedrawing) return;
        this.styleChanged('backgroundAttachment', event.target.getSelectedItem().getId());
      }, false, this);
  goog.events.listen(this.vPositionComboBox,
      goog.ui.Component.EventType.CHANGE,
      function(event) {
        if (this.iAmRedrawing) return;
        var hPosition = this.hPositionComboBox.getSelectedItem().getId();
        var vPosition = this.vPositionComboBox.getSelectedItem().getId();
        this.styleChanged('backgroundPosition', vPosition + ' ' + hPosition);
      }, false, this);
  goog.events.listen(this.hPositionComboBox,
      goog.ui.Component.EventType.CHANGE,
      function(event) {
        if (this.iAmRedrawing) return;
        var hPosition = this.hPositionComboBox.getSelectedItem().getId();
        var vPosition = this.vPositionComboBox.getSelectedItem().getId();
        this.styleChanged('backgroundPosition', vPosition + ' ' + hPosition);
      }, false, this);
  goog.events.listen(this.repeatComboBox,
      goog.ui.Component.EventType.CHANGE,
      function(event) {
        if (this.iAmRedrawing) return;
        this.styleChanged('backgroundRepeat', event.target.getSelectedItem().getId());
      }, false, this);
  goog.events.listen(this.sizeComboBox,
      goog.ui.Component.EventType.CHANGE,
      function(event) {
        if (this.iAmRedrawing) return;
        this.styleChanged('backgroundSize', event.target.getSelectedItem().getId());
      }, false, this);
};


/**
 * redraw the properties
 * @param   {Array<element>} selectedElements the elements currently selected
 * @param   {HTMLDocument} document  the document to use
 * @param   {Array<string>} pageNames   the names of the pages which appear in the current HTML file
 * @param   {string}  currentPageName   the name of the current page
 */
silex.view.pane.BgPane.prototype.redraw = function(selectedElements, document, pageNames, currentPageName) {
  if (this.iAmSettingValue) return;
  this.iAmRedrawing = true;
  // call super
  goog.base(this, 'redraw', selectedElements, document, pageNames, currentPageName);

  // remember selection
  this.selectedElements = selectedElements;
  this.document = document;
  this.pageNames = pageNames;
  this.currentPageName = currentPageName;

  // BG color
  var color = this.getCommonProperty(selectedElements, function (element) {
    return element.style.backgroundColor;
  });
  if (color === 'transparent' || color === '') {
    this.transparentBgCheckbox.setChecked(true);
    this.bgColorPicker.setEnabled(false);
    this.setColorPaletteVisibility(false);
  }
  else if(goog.isNull(color)) {
    // display a "no color" in the button
    this.bgColorPicker.setValue('');
  }
  else {
    // handle all colors, including the named colors
    var color = silex.utils.Style.rgbaToHex(color);

    this.transparentBgCheckbox.setChecked(false);
    this.bgColorPicker.setEnabled(true);
    this.hsvPalette.setColorRgbaHex(color);
    this.bgColorPicker.setValue(this.hsvPalette.getColor());
  }
  // BG image
  var bgImage = this.getCommonProperty(selectedElements, function (element) {
    return element.style.backgroundImage;
  });
  if (bgImage !== null &&
      bgImage !== 'none' &&
      bgImage !== '') {
    this.bgClearBgImage.setEnabled(true);
    this.attachmentComboBox.setEnabled(true);
    this.vPositionComboBox.setEnabled(true);
    this.hPositionComboBox.setEnabled(true);
    this.repeatComboBox.setEnabled(true);
    this.sizeComboBox.setEnabled(true);
  }
  else {
    this.bgClearBgImage.setEnabled(false);
    this.attachmentComboBox.setEnabled(false);
    this.vPositionComboBox.setEnabled(false);
    this.hPositionComboBox.setEnabled(false);
    this.repeatComboBox.setEnabled(false);
    this.sizeComboBox.setEnabled(false);
  }
  // bg image attachment
  var bgImageAttachment = this.getCommonProperty(selectedElements, function (element) {
    return element.style.backgroundAttachment;
  });
  if (bgImageAttachment) {
    switch (bgImageAttachment) {
      case 'scroll':
        this.attachmentComboBox.setSelectedIndex(0);
        break;
      case 'fixed':
        this.attachmentComboBox.setSelectedIndex(1);
        break;
      case 'local':
        this.attachmentComboBox.setSelectedIndex(2);
        break;
    }
  }
  else {
    this.attachmentComboBox.setSelectedIndex(0);
  }
  // bg image position
  var bgImagePosition = this.getCommonProperty(selectedElements, function (element) {
    return element.style.backgroundPosition;
  });
  if (bgImagePosition) {
    // convert 50% in cennter
    var posArr = bgImagePosition.split(' ');
    var hPosition = posArr[0];
    var vPosition = posArr[1];

    // convert 0% by left, 50% by center, 100% by right
    hPosition = hPosition
    .replace('100%', 'right')
    .replace('50%', 'center')
    .replace('0%', 'left');

    // convert 0% by top, 50% by center, 100% by bottom
    vPosition = vPosition
    .replace('100%', 'bottom')
    .replace('50%', 'center')
    .replace('0%', 'top');

    switch (vPosition) {
      case 'top':
        this.vPositionComboBox.setSelectedIndex(0);
        break;
      case 'center':
        this.vPositionComboBox.setSelectedIndex(1);
        break;
      case 'bottom':
        this.vPositionComboBox.setSelectedIndex(2);
        break;
    }
    switch (hPosition) {
      case 'left':
        this.hPositionComboBox.setSelectedIndex(0);
        break;
      case 'center':
        this.hPositionComboBox.setSelectedIndex(1);
        break;
      case 'right':
        this.hPositionComboBox.setSelectedIndex(2);
        break;
    }
  }
  else {
    this.vPositionComboBox.setSelectedIndex(0);
    this.hPositionComboBox.setSelectedIndex(0);
  }
  // bg image repeat
  var bgImageRepeat = this.getCommonProperty(selectedElements, function (element) {
    return element.style.backgroundRepeat;
  });
  if (bgImageRepeat) {
    switch (bgImageRepeat) {
      case 'repeat':
        this.repeatComboBox.setSelectedIndex(0);
        break;
      case 'repeat-x':
        this.repeatComboBox.setSelectedIndex(1);
        break;
      case 'repeat-y':
        this.repeatComboBox.setSelectedIndex(2);
        break;
      case 'no-repeat':
        this.repeatComboBox.setSelectedIndex(3);
        break;
      case 'inherit':
        this.repeatComboBox.setSelectedIndex(4);
        break;
    }
  }
  else {
    this.repeatComboBox.setSelectedIndex(0);
  }
  // bg image size
  var bgImageSize = this.getCommonProperty(selectedElements, function (element) {
    return element.style.backgroundSize;
  });
  if (bgImageSize) {
    switch (bgImageSize) {
      case 'auto':
        this.sizeComboBox.setSelectedIndex(0);
        break;
      case 'contain':
        this.sizeComboBox.setSelectedIndex(1);
        break;
      case 'cover':
        this.sizeComboBox.setSelectedIndex(2);
        break;
    }
  }
  else {
    this.sizeComboBox.setSelectedIndex(0);
  }
  this.iAmRedrawing = false;
};


/**
 * User has selected a color
 */
silex.view.pane.BgPane.prototype.onColorChanged = function() {
  var color = silex.utils.Style.hexToRgba(this.hsvPalette.getColorRgbaHex());
  // update the button
  this.bgColorPicker.setValue(this.hsvPalette.getColor());

  // notify the toolbox
  this.styleChanged('backgroundColor', color);
};


/**
 * User has clicked on the color button
 * open or close the palete
 */
silex.view.pane.BgPane.prototype.onBgColorButton = function() {
  var element = this.selectedElements[0];
  // show the palette
  if (this.getColorPaletteVisibility() === false) {
    this.hsvPalette.setColorRgbaHex(
        silex.utils.Style.rgbaToHex(element.style.backgroundColor)
    );
    this.setColorPaletteVisibility(true);
  }
  else {
    this.setColorPaletteVisibility(false);
  }
};


/**
 * User has clicked the transparent checkbox
 */
silex.view.pane.BgPane.prototype.onTransparentChanged = function() {
  var color = 'transparent';
  if (this.transparentBgCheckbox.getChecked() === false) {
    color = silex.utils.Style.hexToRgba(this.hsvPalette.getColorRgbaHex());
    if (!color) {
      //color='#FFFFFF';
      color = 'rgba(255, 255, 255, 1)';
    }
  }
  // notify the toolbox
  this.styleChanged('backgroundColor', color);
  // redraw myself (styleChange prevent myself to redraw)
  this.redraw(this.selectedElements, this.document, this.pageNames, this.currentPageName);
};


/**
 * User has clicked the select image button
 */
silex.view.pane.BgPane.prototype.onSelectImageButton = function() {
  this.controller.propertyToolController.browseBgImage();
};


/**
 * User has clicked the clear image button
 */
silex.view.pane.BgPane.prototype.onClearImageButton = function() {
  this.styleChanged('backgroundImage', '');
};


/**
 * color palette visibility
 * do not set display to none,
 * because the setColor then leave the color palette UI unchanged
 * @return    {boolean} true if the color palete is visible
 */
silex.view.pane.BgPane.prototype.getColorPaletteVisibility = function() {
  return goog.style.getStyle(this.hsvPalette.getElement(),
      'visibility') !== 'hidden';
};


/**
 * color palette visibility
 * do not set display to none,
 * because the setColor then leave the color palette UI unchanged
 * @param {boolean} isVisible    The desired visibility
 */
silex.view.pane.BgPane.prototype.setColorPaletteVisibility = function(isVisible) {
  if (isVisible) {
    if (!this.getColorPaletteVisibility()) {
      goog.style.setStyle(this.hsvPalette.getElement(),
          'visibility',
          '');
      goog.style.setStyle(this.hsvPalette.getElement(),
          'position',
          '');
    }
  }
  else {
    if (this.getColorPaletteVisibility()) {
      goog.style.setStyle(this.hsvPalette.getElement(),
          'visibility',
          'hidden');
      goog.style.setStyle(this.hsvPalette.getElement(),
          'position',
          'absolute');
    }
  }
};
