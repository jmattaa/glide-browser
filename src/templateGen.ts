import fs from 'fs';

function parse(code: string, vars: any) {
    // love regex
    let varRegex = /\#\{(.*?)}/g;
    return code.replace(varRegex, (match, varname: string): string => {
        return vars[varname] || match; // keeping it as is if there is no var
    });
}

export function genFromTemplateFile(
    templatefile: string,
    destfile: string,
    vars: any
) {
    fs.readFile(templatefile, (err, res) => {
        if (err)
            throw Error(err + '\r\nQUIVER NOT INSTALLED CORRECTLY!');

        let newfilecode = parse(res.toString(), vars);
        fs.writeFileSync(destfile, newfilecode);
    });
}
