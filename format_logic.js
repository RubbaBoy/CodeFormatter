module.exports =                                                                                            {
    format_logic: function(input, amountExtra)                                                              {
        input = input.replace(/\t/g, "   ").match(/[^\r\n]+/g)                                              ;
        let distanceOut = 0                                                                                 ;
        for (let i = 0; i < input.length; i++)                                                              {
            if (distanceOut < input[i].length)                                                              {
                distanceOut = input[i].length                                                          ;}}  
        distanceOut += amountExtra                                                                          ;
        let output = ""                                                                                     ;
        let rows = [input.length]                                                                           ;
        for (let i = 0; i < input.length; i++)                                                              {
            let line = input[i]                                                                             ;
            rows[i] = ""                                                                                    ;
            if (line.endsWith("{"))                                                                         {
                rows[i] += "{"                                                                              ;
                input[i] = line.substring(0, line.lastIndexOf("{"))                                    ;}   
              else                                                                                          {
                if (line.endsWith(";"))                                                                     {
                    rows[i] += ";"                                                                          ;
                    input[i] = line.substring(0, line.lastIndexOf(";"))                                ;}}  
            let val = specialStartsWith(input[i], "}")                                                      ;
            if (val.starts)                                                                                 {
                input[i] = repeat(" ", val.len + 1) + input[i].substring(val.len + 1, input[i].length)      ;
                if (input[i].trim() === "")                                                                 {
                    rows[i - 1] += "}"                                                                 ;}   
                  else                                                                                      {
                    rows[i - 1] += "}"                                                                 ;}}} 
        for (let i = input.length - 1; i >= 0; i--)                                                         {
            if (input[i].trim() === "")                                                                     {
                rows[i - 1] += rows[i]                                                                      ;
                rows[i] = ""                                                                           ;}}  
        function repeat(string, amount)                                                                     {
            let ret = ""                                                                                    ;
            for (let i = 0; i < amount; i++)                                                                {
                ret += string                                                                          ;}   
            return ret                                                                                 ;}   
        function specialStartsWith(line, character)                                                         {
            let ret = {}                                                                                    ;
            for (let i = 0; i < line.length; i++)                                                           {
                if (line.charAt(i) === character)                                                           {
                    ret.starts = true                                                                       ;
                    ret.len = i                                                                             ;
                    return ret                                                                         ;}   
                if (line.charAt(i) !== " ")                                                                 {
                    ret.starts = false                                                                      ;
                    return ret                                                                         ;}}  
            ret.starts = false                                                                              ;
            return ret                                                                                 ;}   
        for (let i = 0; i < input.length; i++)                                                              {
            input[i] += getPadding(input[i]) + rows[i]                                                 ;}   
        for (let i = 0; i < input.length; i++)                                                              {
            let row = input[i]                                                                              ;
            if (row.trim().length !== 0) output += input[i] + "\n"                                     ;}   
        return output                                                                                       ;
        function getPadding(line)                                                                           {
            return repeat(" ", distanceOut - line.length)                                              ;}}} ;
