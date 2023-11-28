/** モールス信号Map */
const morseCodeMap: {[key: string]: string} = {
    a: ".-",
    b: "-...",
    c: "-.-.",
    d: "-..",
    e: ".",
    f: "..-.",
    g: "--.",
    h: "....",
    i: "..",
    j: ".---",
    k: "-.-",
    l: ".-..",
    m: "--",
    n: "-.",
    o: "---",
    p: ".--.",
    q: "--.-",
    r: ".-.",
    s: "...",
    t: "-",
    u: "..-",
    v: "...-",
    w: ".--",
    x: "-..-",
    y: "-.--",
    z: "--..",
}

/** 暗号化する入力の正規表現 */
const regEncryption = /^[a-zA-Z\s]*$/
/** 復号化する入力の正規表現 */
const regDecryption = /^[\-\.\s]*$/



/**
 * a-zの間で文字を任意の分だけずらします。
 * @param text 
 * @param shift 
 */
const shiftCharCode = (text: string, shift: number): string => {
    const charNum = 26
    shift %= charNum

    // char code(a-z)'s range -> 97-122
    // a: 97
    // z: 122

    let output = ""
    for(let i = 0; i < text.length; i++) {
        const char = text.charAt(i)
        let charCode = char.charCodeAt(0)

        if(charCode + shift > 122) charCode -= charNum
        else if(charCode + shift < 97) charCode += charNum

        output += String.fromCharCode(charCode + shift)
    }

    return output
}

/**
 * keyからvalueを検索
 * @param object 
 * @param value 
 * @returns 
 */
const getKeyByValue = (object: Record<string, unknown>, value: unknown) => {
    return Object.keys(object).find((key) => object[key] === value)
}

/**
 * 暗号化を行います。
 * @param text 
 */
const encryption = (text: string, shift=1): string => {
    // 空文字削除
    text = text.replaceAll(/\s/g, "").toLowerCase()
    text = shiftCharCode(text, shift)

    let output = ""
    for(let i = 0; i < text.length; i++) {
        const char = text.charAt(i)

        output += `${ morseCodeMap[char] } `
    }
    output = output.slice(0, -1)

    return output
}

/**
 * 復号化を行います。
 * @param text 
 */
const decryption = (text: string, shift=-1): string => {
    const morseCodes = text.split(" ")

    let output = ""
    for(let i = 0; i < morseCodes.length; i++) {
        const key = getKeyByValue(morseCodeMap, morseCodes[i])
        output += key
    }
    output = shiftCharCode(output, shift)

    return output
}

window.addEventListener("DOMContentLoaded", () => {

    const textareaInput = document.getElementById("textarea-input") as HTMLTextAreaElement
    const buttonEncryption = document.getElementById("button-encryption") as HTMLButtonElement
    const buttonDecryption = document.getElementById("button-decryption") as HTMLButtonElement
    const textareaOutput = document.getElementById("textarea-output") as HTMLTextAreaElement
    const buttonCopy = document.getElementById("button-copy") as HTMLButtonElement



    // 暗号化
    buttonEncryption.onclick = () => {
        const input = textareaInput.value

        // 正規表現にマッチするか？
        if(regEncryption.test(input)) {
            console.log("OK")
            textareaInput.classList.remove("warn")

            textareaOutput.value = encryption(input)
        } else {
            textareaInput.classList.add("warn")
        }
    }

    // 復号化
    buttonDecryption.onclick = () => {
        const input = textareaInput.value

        // 正規表現にマッチするか？
        if(regDecryption.test(input)) {
            console.log("OK")
            textareaInput.classList.remove("warn")

            textareaOutput.value = decryption(input)
        } else {
            textareaInput.classList.add("warn")
        }
    }

    // アウトプットのコピー
    buttonCopy.onclick = () => {
        const output = textareaOutput.value

        navigator.clipboard.writeText(output)
    }

})