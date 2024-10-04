
export function parseURL(full_url){

    let [ url, options ] = full_url.split("#");
    
    if(options){
        options = options.trim();
        options = options 
            ? options.split("&").reduce( (opts, option) => {
                let [ opt_name, value ] = option.split("=");
                switch(value){
                    case "true":  value = true;  break;
                    case "false": value = false; break;
                    case "null":  value = null;  break;
                    default: {
                        if (value.match(/^-?\.?[0-9.]+$/)) value = parseFloat(value);
                    }
                }
                opts[opt_name] = value;
                return opts;
            }, {})
            : undefined;
    }
    



    url = url.trim();
    return { url, options };
}