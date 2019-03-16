## To Google Translate
### Introduction
 
This extension creates a context menu item in the browser, when you click on a menu item, the current page url or the previously selected text is sent to Google Translate. You can also setup default language in the option page.

### How to use
#### Changing the default language
First you should change the default language settings by accessing to about:addons > To Google Translate option page.

#### Translating text
Select any text in some web page and then right click with your mouse

![](https://raw.githubusercontent.com/itseco/to-google-translate/master/screenshot.png)

![](https://raw.githubusercontent.com/itseco/to-google-translate/master/google-translate.png)

### Testing out the extension
You can test the extension in Firefox with *web-ext*. *web-ext* can be installed with the Node Package Manager.
```sh
sudo npm install --global web-ext
```
Download the code from Github
```sh
git clone https://github.com/itseco/to-google-translate.git
cd to-google-translate
make prepare
```

Run in the root folder extension the command
```sh
web-ext run
```