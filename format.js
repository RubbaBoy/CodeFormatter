/*                                                                                                       
Usage:                                                                                                   
  If no path is specified, it will go off of the current directory                                       
  Arguments:                                                                                             
  <> = optional                                                                                          
  [] = requires one of the options between |                                                             
  node format.js <amount extra> [clone https://github.com/username/repo | paths...]                      
 */                                                                                                      
const fs = require('fs')                                                                                 ;
const {exec} = require('child_process')                                                                  ;
const format = require('./format_logic')                                                                 ;
const concat = (x, y) =>                                                                                 
    x.concat(y)                                                                                          ;
const flatMap = (f, xs) =>                                                                               
    xs.map(f).reduce(concat, [])                                                                         ;
Array.prototype.flatMap = function (f)                                                                   {
    return flatMap(f, this)                                                                              };
let args = process.argv.splice(2)                                                                        ;
let amountExtra = 0                                                                                      ;
if (args.length > 0 && isNumeric(args[0]))                                                               {
    amountExtra = args[0]                                                                                ;
    args = args.splice(1)                                                                                ;}
let promise = new Promise(function (resolve, reject)                                                     {
    // Cloning URL from git                                                                              
    if (args.length === 2 && args[0].toLowerCase() === 'clone' && args[1].includes('http'))              {
        exec(`git clone ${args[1]}`, (err, stdout, result) =>                                            {
            if (err)                                                                                     {
                console.log(err)                                                                         ;
                resolve('There was a problem cloning')                                                   ;
                return                                                                                   ;}
            let newDir = result.toString().substring('Cloning into \''.length, result.length - 5)        ;
            args = [`${process.cwd()}/${newDir}`]                                                        ;
            resolve(result)                                                                              ;}
         )                                                                                               ;}
      else                                                                                               {
        resolve()                                                                                        ;}}
 )                                                                                                       ;
promise.then((reason) =>                                                                                 {
    if (reason === 'There was a problem cloning') return                                                 ;
    let toFormat = args.length > 0 ? args : [process.cwd()]                                              ;
    function getFiles(path)                                                                              {
        if (path.endsWith('.git') || !fs.existsSync(path)) return []                                     ;
        let stat = fs.statSync(path)                                                                     ;
        return stat.isDirectory() ? fs.readdirSync(path).flatMap(x => getFiles(`${path}/${x}`)) : [path] ;}
    let files = toFormat.flatMap(path =>                                                                 {
        return getFiles(path)                                                                            ;}
     )                                                                                                   ;
    files.forEach(file =>                                                                                {
        let contents = fs.readFileSync(file, 'utf8')                                                     ;
        let formatted = format.format_logic(contents, amountExtra)                                       ;
        fs.writeFile(file, formatted, function (err)                                                     {
            if (err !== null) console.log("Error while writing data: " + err)                            ;}
         )                                                                                               ;}
     )                                                                                                   ;}
 )                                                                                                       ;
function isNumeric(n)                                                                                    {
    return !isNaN(parseFloat(n)) && isFinite(n)                                                          ;}
