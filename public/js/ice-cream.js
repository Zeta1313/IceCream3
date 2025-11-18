document.getElementById("form").onsubmit = () => {
    clearErrors();
    let isValid = true;

    let name = document.getElementById("name").value.trim();
    if(!name) {
        document.getElementById("err-name").style.display = "block";
        isValid = false;
    }
    
    let email = document.getElementById("email").value.trim();
    if(!email || email.indexOf("@") === -1) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    let select = document.getElementById("flavor").value;
    if(select === "none") {
        document.getElementById("err-select").style.display = "block";
        isValid = false;
    }

    let radio = document.getElementsByName("cone");
    let count = 0;
    for(let i = 0; i < radio.length; i++) {
        if(radio[i].checked) {
            count++;
        }
    }

    if(count === 0) {
        document.getElementById("err-radio").style.display = "block";
        isValid = false;
    }


    return isValid;
}

function clearErrors() {
    let errors = document.getElementsByClassName("error");
    for(let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}


