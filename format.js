/*                                                                                                       
Usage:                                                                                                   
  If no path is specified, it will go off of the current directory                                       
  Arguments:                                                                                             
  <> = optional                                                                                          
  [] = requires one of the options between |                                                             
  node format.js <amount extra> [https://github.com/username/repo true | paths...]                       
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
let push = false                                                                                         ;
let url = ''                                                                                             ;
let args = process.argv.splice(2)                                                                        ;
let amountExtra = 0                                                                                      ;
let directory = ''                                                                                       ;
if (args.length > 0 && isNumeric(args[0]))                                                               {
    amountExtra = args[0]                                                                                ;
    args = args.splice(1)                                                                                ;}
let promise = new Promise(function (resolve, reject)                                                     {
        // Cloning URL from git                                                                          
        if ((args.length === 1 || args.length === 2) && args[0].includes('http'))                        {
            push = args.length === 2 ? args[1] === 'true' : false                                        ;
            url = args[0]                                                                                ;
            let repoName = url.endsWith('/') ? url.splice(0, -1) : url                                   ;
            let spliced = repoName.split('/')                                                            ;
            repoName = spliced[spliced.length - 1]                                                       ;
            directory = `${process.cwd()}/${repoName}`                                                   ;
            if (fs.existsSync(directory))                                                                {
                console.log("Repository already exists, updating it...")                                 ;
                exec(`git pull ${url}`,                                                                  {
                        cwd: directory                                                                   }
                     , (err, stdout, result) =>                                                          {
                        if (err)                                                                         {
                            console.log(err)                                                             ;
                            resolve('There was a problem pulling')                                       ;
                            return                                                                       ;}
                        args[0] = directory                                                              ;
                        console.log("Successfully cloned repository")                                    ;
                        resolve(result)                                                                  ;}
                )                                                                                        ;}
              else                                                                                       {
                exec(`git clone ${url}`, (err, stdout, result) =>                                        {
                        if (err)                                                                         {
                            console.log(err)                                                             ;
                            resolve('There was a problem cloning')                                       ;
                            return                                                                       ;}
                        args[0] = directory                                                              ;
                        console.log("Successfully cloned repository")                                    ;
                        resolve(result)                                                                  ;}
                )                                                                                        ;}}
          else                                                                                           {
            resolve()                                                                                    ;}}
)                                                                                                        ;
promise.then(reason =>                                                                                   {
    if (reason !== undefined && reason.includes('There was a problem')) return                           ;
    let toFormat = args.length > 0 ? args : [process.cwd()]                                              ;
    function getFiles(path)                                                                              {
        if (path.endsWith('.git') || !fs.existsSync(path)) return []                                     ;
        let stat = fs.statSync(path)                                                                     ;
        return stat.isDirectory() ? fs.readdirSync(path).flatMap(x => getFiles(`${path}/${x}`)) : [path] ;}
    let files = toFormat.flatMap(path =>                                                                 {
            return getFiles(path)                                                                        ;}
    )                                                                                                    ;
    files.forEach(file =>                                                                                {
            let contents = fs.readFileSync(file, 'utf8')                                                 ;
            let formatted = format.format_logic(contents, amountExtra)                                   ;
            fs.writeFile(file, formatted, function (err)                                                 {
                    if (err !== null) console.log("Error while writing data: " + err)                    ;}
            )                                                                                            ;}
    )                                                                                                    ;
    console.log(`Completed formatting of ${files.length} files`)                                         ;
    if (!push) return                                                                                    ;
    console.log("Committing and pushing the repo...")                                                    ;
    exec(`git add .`,                                                                                    {
        cwd: directory                                                                                   }
     , (err, stdout, result) =>                                                                          {
        if (err)                                                                                         {
            console.log("Error adding files")                                                            ;
            console.log(err)                                                                             ;
            return                                                                                       ;}
        exec(`git commit -m "Formatted with https://github.com/RubbaBoy/CodeFormatter"`,                 {
            cwd: directory                                                                               }
         , (err, stdout, result) =>                                                                      {
            if (err)                                                                                     {
                console.log("Error committing")                                                          ;
                console.log(err)                                                                         ;
                return                                                                                   ;}
            exec(`git push ${url}`,                                                                      {
                cwd: directory                                                                           }
             , (err, stdout, result) =>                                                                  {
                if (err)                                                                                 {
                    console.log("Error pushing")                                                         ;
                    console.log(err)                                                                     ;
                    return                                                                               ;}
                console.log(`Successfully pushed to ${url}`)                                             ;}
             )                                                                                           ;}
         )                                                                                               ;}
     )                                                                                                   ;}
 )                                                                                                       ;
function isNumeric(n)                                                                                    {
    return !isNaN(parseFloat(n)) && isFinite(n)                                                          ;}
