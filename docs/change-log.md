# change logs

This is where you will find the recent changes made to Silex, and available on http://www.silex.me/

## June 2014

bug fixes

* fixed bugs which prevent images to show up
* fixed "iframe can not be dragged when youtube player in it"

features

* changed tabulation order in property pane, propery pane bugs
* updated cloud explorer
* fixed folder selection, and file extensions filter

code quality

* code cleanup
* fixed functional tests
* fixed npm, grunt and errors when running Silex in local
* added monitis and newrelic monitoring

silex website

* added tags
* favicon

## May 2014

bug fixes

* heavy websites publication

features

* new version of cloud explorer, with new UI
* loading while loading a new website

code quality and doc

* refactored to a better mvc design pattern
* website loaded in an iframe instead of div
* new website
* support for newrelic monitoring

## April 2014

bug fixes

* support for google chrome automatic translation

features

* updated [unifile](https://github.com/silexlabs/unifile) version, with FTP support

code quality and doc

* refactored functional tests with webdriver.js
* closure linter and compiler as submodules
* fixed build warnings
* cleanup

## March 2014

bug fixes

* many bug fixes in publication algorythm
* page names starting with number or with a question mark

features

* seo properties alt and title
* added background image size options
* link editor support for deeplinks (internal page links)
* allow HTML anchors in addition to deep links
* downlaods silex static files to dropbox when publishing a site
* added an error message when trying to open a non-editable website

## Feb 2014

bug fixes

* fixed bugs and inconsistencies in firefox
* fixed bugs and inconsistencies in IE
* fixed publish settings popin
* fixed stage size on mobiles and when trying to put an element under the main container

features

* multi selection
* desktop notifications for chrome
* improved UI and stability
* added waffle.io badge
* new links in the help menu
* a css class is applyed to active links
* docs folder in the source, with contributors, roadmap etc

code quality and doc

* more functional tests
* docs and new silex site

## Jan 2014

bug fixes

* CSS/UI display bugs
* text editor background color should be the same as the text field bg color
* body size in front end (when the viewport is smaller than the site)
* text links formatting is blue with underline
* scroll combo box and backgroundAttachment style
* better QOS/user actions tracking
* remove focus from UI text fields when you click on the stage (used to cause many strange behaviors in editors and to interact with shortcuts)

features

* added js editor and css editor
* copy / paste
* added inline style editor (css of the selected element in apolo mode)
* added css class name of the selected element (apolo mode)
* added predefined styles in the text editor (Title, quotes...)
* better silex.me temporary landing page
* basics of backward compatibility management
* basics for page transitions and
* images background transparent by default
* text field overflow (when text is too long, scroll bars appear)
* added code to make silex a chrome app https://chrome.google.com/webstore/detail/silex-live-web-creation/pjapkdalpbohjofmdibkcgkkhohakcje?hl=en


code

* more functional tests
* build on heroku and travis, so the compiled js and css files are not versioned anymore

## Dec 2013

bug fixes

* file extension validator
* use Silex in local while offline
* add comp, take scroll into account
* text editor in ff
* publication for URLs with non ascii chars

features

* keyboard shortcuts
* changed size of new website
* lorem ipsum button in text editor
* user does "publish" when there is no publication path set => warning before opening settings pannel
* google fonts in the text editor - contribution of Yannick Dominguez

code

* code refactoring
* cleanup repo
* source mapping
* better grunt file
* added make file...

