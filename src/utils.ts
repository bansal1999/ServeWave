const MAX_LEN = 5;

export function generate(){
    let id = "";
    const subset = "1234556asdfghjklqwertyuiop";
    for(let i =0; i< MAX_LEN; i++){
        id += subset[Math.floor(Math.random()* subset.length)];
    }

    return id;
}