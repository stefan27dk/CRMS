


// Search Object
export const searchObject = (obj, match) => {
    for (const p in obj) {
        let type = typeof obj[p];

        // String
        if (type === 'string') {
            if (obj[p].toLocaleLowerCase().includes(match) === true) {
                return obj;
            }
        }
        // Int, Float, Bool, BigInt
        else if (type === 'number' || type === 'boolean' || type === 'bigint') {
            if (obj[p].toString().toLocaleLowerCase().includes(match) === true) {
                return obj;
            }
        }
        // Object
        else if (type === 'object') {
            let subResult = searchObject(obj[p], match); // Returns sub object
            if (subResult !== undefined) {
                return obj;
            }
        }
    }
}

 
 

// Search Array
export const searchArray = (arr, match) => {
    console.time();
    let resultArr = [];
    for (let b = arr.length; b--;) {
        let type = typeof arr[b];

        // Object
        if (type === 'object') {
            let result = searchObject(arr[b], match);
            if (result !== undefined) {
                resultArr.push(result);
            }
        }
        // String
        else if (type === 'string') {
            if (arr[b].toLocaleLowerCase().includes(match) === true) {
                resultArr.push({ stringValue: arr[b] });
            }
        }
        // Int, Float, Bool, BigInt
        else if (type === 'number' || type === 'boolean' || type === 'bigint') {
            if (arr[b].toString().toLocaleLowerCase().includes(match) === true) {
                resultArr.push({ [type + 'Value']: arr[b] });
            }
        }
    } console.timeEnd();
    return resultArr;
}