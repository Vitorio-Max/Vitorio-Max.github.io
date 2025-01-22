let buttonValue;

decreseNumber = () => {
    buttonValue =parseInt(document.getElementById("number").innerHTML) - 1;
    document.getElementById("number").innerHTML = buttonValue;
    return;
}

resetNumber = () => {
    document.getElementById("number").innerHTML = 0;
    return;
}

increseNumber = () => {
    buttonValue = parseInt(document.getElementById("number").innerHTML) + 1;
    document.getElementById("number").innerHTML = buttonValue;
    return;
}