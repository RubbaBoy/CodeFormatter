# CodeFormatter
Have you ever been looking at someone's program and noticed how many annoying semicolons and brackets are in the way of their code? Well now you can move them all to the side, to keep them away from your beautiful code!
## Features
- Able to run on the web for use in the browser
- Can format multiple files at a time
- Can format all files in a directory
- Can automatically clone and format a project
- Can adjust the spacing levels
## Usage
### Web
To use the web version, you can either go to <https://rubbaboy.me/codeformatter/> for a hosted version of this project, or you can just upload the `index.html` and `format_logic.js` files to your webserver.
### CLI
The CLI of CodeFormatter is very easy to use, and has a few different options.
**Singe File** - `node format file-to-format.js` - This formats a single file or directory
**Multiple Files** - `node format file-1.js file-2.js directory-name` - This does the same as above, but with multiple of whatever you want
**Formatting a Git repository** - `node format clone https://github.com/RubbaBoy/CodeFormatter` - This clones the given Git repository and then formats it
**Adjusting Extra Space** - `node format 5 file-to-format.js` - A number can be put after `format` in any command, and adds an extra amount of space. This is by default `0`
## Showcase
Code before (Code found from [here](https://stackoverflow.com/q/33874567)):
![](https://rubbaboy.me/images/4meunbc)

Code after:
![](https://rubbaboy.me/images/hlld2ie)

Here is an example with an adjusted 25 extra spaces:
![](https://rubbaboy.me/images/m760pad)
