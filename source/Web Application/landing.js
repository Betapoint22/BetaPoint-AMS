
sessionStorage.setItem('sessionVar', null);

// access application form
let appName = document.getElementById('appName');
let appID = document.getElementById('appID');
let appEmail = document.getElementById('appEmail');
let appContact = document.getElementById('appContact');

// let login form 

let userEmail = document.getElementById('userEmail');
let userPass = document.getElementById('userPass');

// asset request form

let reqName = document.getElementById('reqName');
let reqID = document.getElementById('reqID');
let assetID = document.getElementById('assetID');
let assetDept = document.getElementById('assetDept');
let source = document.getElementById('source');
let destination = document.getElementById('destination');

// contact form 

let visitorName = document.getElementById('visitorName');
let visitorID = document.getElementById('visitorID');
let visitorMsg = document.getElementById('visitorMsg');

// form elements 
let formSlider = document.getElementById('formSlider');
let accessForm = document.getElementById('accessForm');
let loginForm = document.getElementById('loginForm');
let assetForm = document.getElementById('assetForm');
let assetFormFront = document.getElementById('assetFormFront');
let assetFormBack = document.getElementById('assetFormBack');
let contactForm = document.getElementById('contactForm');
let contactFormFront = document.getElementById('contactFormFront');
let contactFormBack = document.getElementById('contactFormBack');
let formResponse = document.getElementById('formResponse');
let modal = document.querySelectorAll('.modal');

// form submit elements 

let submitAccssForm = document.getElementById('submitAccessForm');
let submitLoginForm = document.getElementById('submitLoginForm');
let submitAssetForm = document.getElementById('submitAssetForm');
let submitContactForm = document.getElementById('submitContactForm');

// form launch elements

let launchContactForm = document.getElementById('launchContactForm');
let launchRequestForm = document.getElementById('launchRequestForm');
let showReqForm = document.getElementById('showReqBtn');
let showLoginForm = document.getElementById('showLoginBtn');

// counters 

let contactModalCounter = 0;
let assetModalCounter = 0;
let formResponseCounter = 0;
let formSliderCounter = 0;
let formCounter = 0;

// UI change 

let toggleBtn = document.getElementById('switch');

showReqForm.addEventListener('click',(e)=>{
    e.preventDefault();
    if(formCounter != 0){
        formCounter = 0;
        formSlider.style.transform = `translate(` + (-formCounter * 500) +`px)`;
    }
})
showLoginForm.addEventListener('click',(e)=>{
    e.preventDefault();
    if(formCounter != 1){
        formCounter = 1;
        formSlider.style.transform = `translate(` + (-formCounter * 500) +`px)`;
    }
})

// submit AccessForm 

submitAccssForm.addEventListener('click', (e)=>{
    e.preventDefault();
    appNameValue = appName.value;
    appIDValue = appID.value;
    appEmailValue = appEmail.value;
    appContactValue = appContact.value;

    let inputState1 = inputCheck(appName, appNameValue, 'string');
    let inputState2 = inputCheck(appID, appIDValue, 'number');
    let inputState3 = inputCheck(appEmail, appEmailValue, 'string');
    let inputState4 = inputCheck(appContact, appContactValue, 'number');

    if(inputState1 && inputState2 && inputState3 && inputState4 && appContactValue.toString().length <= 10){
        $.post(
            "http://127.0.0.1:3000/reqAccess",
            {
                appName : appNameValue,
                appID : appIDValue,
                appEmail : appEmailValue,
                appContact : appContactValue
            },
            function(result){
                let icon = formResponse.querySelector('i.responseIcon');
                let responseTitle = formResponse.querySelector('.responseTitle');
                let responseMsg = formResponse.querySelector('.responseMsg');
                if(parseInt(result[0])==1){
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-smile');
                    icon.className = 'bx bx-smile responseIcon';
                    responseTitle.innerText = 'Request Received';
                    responseMsg.innerText = result[1];
                    formResponse.style.backgroundColor = '#A6DBCB';
                    formResponse.style.transition = 'all 0.4s ease-in-out 0s';
                    formResponse.style.top = '50%';
                    formResponse.style.transform = 'translate(-50%, -50%)';
                }
                else if(parseInt(result[0]) == 0){
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-smile');
                    icon.className = 'bx bx-sad responseIcon';
                    responseTitle.innerText = 'Access Denied';
                    responseMsg.innerText = result[1];
                    formResponse.style.backgroundColor = '#e79b9b';
                    formResponse.style.transition = 'all 0.4s ease-in-out 0s';
                    formResponse.style.top = '50%';
                    formResponse.style.transform = 'translate(-50%, -50%)';
                }
            }
        )
    }
    else if(appContactValue.toString().length > 10){           
        // let icon = formResponse.querySelector('i.responseIcon');
        // let responseTitle = formResponse.querySelector('.responseTitle');
        // let responseMsg = formResponse.querySelector('.responseMsg');
        // icon.classList.remove('bx');
        // icon.classList.remove('bx-smile');
        // icon.className = 'bx bx-sad responseIcon';
        // responseTitle.innerText = 'Access Denied';
        // responseMsg.innerText = 'Phone number cannot be more than 10 digits';
        // formResponse.style.backgroundColor = '#e79b9b';
        // formResponse.style.transition = 'all 0.4s ease-in-out 0s';
        // formResponse.style.top = '50%';
        // formResponse.style.transform = 'translate(-50%, -50%)';

        let errMsgElement = appContact.parentElement.nextElementSibling;
        let errMsg = `Contact cannot be more than 10 digits`;
        errMsgElement.innerText = errMsg;
        errMsgElement.style.visibility = 'visible';

    }
}); // end of access form

// submit login form 

submitLoginForm.addEventListener('click', (e)=>{
    e.preventDefault();
    let userEmailValue = userEmail.value;
    let userPassValue = userPass.value;

    let inputState1 = inputCheck(userEmail, userEmailValue);
    let inputState2 = inputCheck(userPass, userPassValue);

    if(inputState1 && inputState2){
        $.post(
            "http://127.0.0.1:3000/login",
            {
                userEmail : userEmailValue,
                userPass : userPassValue
            },
            function(result){
                if(parseInt(result[0]) != 0){
                    console.log(result);
                    sessionStorage.setItem('userMail', userEmailValue);
                    sessionStorage.setItem('sessionVar', 'pass');
                    sessionStorage.setItem('userDept', result[1]);
                    window.location.href = `./dashboard.html`;
                    // console.log('logged in');
                    console.log(sessionStorage.getItem('userDept'));
                }
                else if(parseInt(result[0]) == 0){
                    let icon = formResponse.querySelector('i.responseIcon');
                    let responseTitle = formResponse.querySelector('.responseTitle');
                    let responseMsg = formResponse.querySelector('.responseMsg');
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-smile');
                    icon.className = 'bx bx-smile responseIcon';
                    responseTitle.innerText = 'Access Denied';
                    responseMsg.innerText = 'Kindly check your credentials';
                    formResponse.style.backgroundColor = '#e79b9b';
                    formResponse.style.transition = 'all 0.4s ease-in-out 0s';
                    formResponse.style.top = '50%';
                    formResponse.style.transform = 'translate(-50%, -50%)';
                }
            }
        )
    }
});

// submit asset form

submitAssetForm.addEventListener('click', (e)=>{
    e.preventDefault();
    let reqNameValue = reqName.value;
    let reqIDValue = reqID.value;
    let assetIDValue = assetID.value;
    let assetDeptValue = assetDept.value;
    let sourceValue = source.value;
    let destinationValue = destination.value;

    let inputState1 = inputCheck(reqName, reqNameValue, 'string');
    let inputState2 = inputCheck(reqID, reqIDValue, 'number');
    let inputState3 = inputCheck(assetID, assetIDValue, 'number');
    let inputState4 = inputCheck(assetDept, assetDeptValue, 'string');
    let inputState5 = inputCheck(source, sourceValue, 'string');
    let inputState6 = inputCheck(destination, destinationValue, 'string');
 

    if(inputState1 && inputState2 && inputState3 && inputState4 && inputState5 && inputState6){
        if(sourceValue.trim().toUpperCase() != destinationValue.trim().toUpperCase()){
        $.post(
            "http://127.0.0.1:3000/reqAsset",
            {
                reqName : reqNameValue,
                reqID : reqIDValue,
                assetID : assetIDValue,
                assetDept : assetDeptValue,
                source : sourceValue,
                destination : destinationValue
            },
            function(result){
                console.log(result);
                let icon = assetFormBack.querySelector('.responseIcon');
                let responseTitle = assetFormBack.querySelector('.responseTitle');
                let responseMsg = assetFormBack.querySelector('.responseMsg');

                if(parseInt(result[0]) == 1){
                    // query failure
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Request received';
                    responseMsg.innerText = result[1];
                    assetFormBack.style.backgroundColor = '#A6DBCB';
                    assetFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    assetFormFront.style.transition = 'transform 0.6s linear';
                    assetFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    assetFormBack.style.transition = 'transform 0.6s linear';
                }
                else if(parseInt(result[0]) == 2){
                    // condition not satisfied
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Request Denied';
                    responseMsg.innerText = result[1];
                    assetFormBack.style.backgroundColor = '#f76045';
                    assetFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    assetFormFront.style.transition = 'transform 0.6s linear';
                    assetFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    assetFormBack.style.transition = 'transform 0.6s linear';
                }
                // else if(parseInt(result) == 2){
                //     // condition satisfied
                //     icon.classList.remove('bx');
                //     icon.classList.remove('bx-sad');
                //     icon.className = 'bx bx-party responseIcon';
                //     responseTitle.innerText = 'Request sent';
                //     responseMsg.innerText = 'kindly check your mail'
                //     assetFormBack.style.backgroundColor = '#A6DBCB';
                //     assetFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                //     assetFormFront.style.transition = 'transform 0.6s linear';
                //     assetFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                //     assetFormBack.style.transition = 'transform 0.6s linear';
                // }
                else if(parseInt(result) == 3){
                    // auxillery message for condition not satisfied
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Request denied';
                    responseMsg.innerText = 'Asset alread present at the destination'
                    assetFormBack.style.backgroundColor = '#f76045';
                    assetFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    assetFormFront.style.transition = 'transform 0.6s linear';
                    assetFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    assetFormBack.style.transition = 'transform 0.6s linear';
                }
                else{
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Request Denied';
                    responseMsg.innerText = 'Unknown error'
                    assetFormBack.style.backgroundColor = '#A6DBCB';
                    assetFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    assetFormFront.style.transition = 'transform 0.6s linear';
                    assetFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    assetFormBack.style.transition = 'transform 0.6s linear';
                }
            }
        )
        }
        else{
            let element1 = source.parentElement.nextElementSibling;
            let element2 = destination.parentElement.nextElementSibling;
            element1.innerText = `Value cannot be same`;
            element2.innerText = `Value cannot be same`;
            element1.style.visibility = `visible`;
            element2.style.visibility = `visible`;
        }
    }
});

// submit Contact Form

submitContactForm.addEventListener('click', (e)=>{
    e.preventDefault();
    let visitorNameValue = visitorName.value;
    let visitorIDValue = visitorID.value;
    let visitorMsgValue = visitorMsg.value;

    let inputState1 = inputCheck(visitorName, visitorNameValue);
    let inputState2 = inputCheck(visitorID, visitorIDValue);
    let inputState3 = inputCheck(visitorMsg, visitorMsgValue);

    if(inputState1 && inputState2 && inputState3){
        $.post(
            "http://127.0.0.1:3000/contactUs",
            {
                visitorName : visitorNameValue,
                visitorID : visitorIDValue,
                visitorMsg : visitorMsgValue
            },
            function(result){
                if(parseInt(result) == 1){
                    let icon = contactFormBack.querySelector('.responseIcon');
                    let responseTitle = contactFormBack.querySelector('.responseTitle');
                    let responseMsg = contactFormBack.querySelector('.responseMsg');
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Query sent';
                    responseMsg.innerText = 'kindly check your mail'
                    contactFormBack.style.backgroundColor = '#A6DBCB';
                    contactFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    contactFormFront.style.transition = 'transform 0.6s linear';
                    contactFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    contactFormBack.style.transition = 'transform 0.6s linear';
                }
                else if(parseInt(result) == 0){
                    icon.classList.remove('bx');
                        icon.classList.remove('bx-party');
                        icon.className = 'bx bx-sad responseIcon';
                        responseTitle.innerText = 'Access Denied';
                        responseMsg.innerText = 'kindly check your credentials'
                        contactFormBack.style.backgroundColor = '#e79b9b';
                        contactFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                        contactFormFront.style.transition = 'transform 0.6s linear';
                        contactFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                        contactFormBack.style.transition = 'transform 0.6s linear';
                }
            }
        )
    }
});

$('.clearfield').click(function(e){
    e.preventDefault();
    this.previousElementSibling.value = '';
});

$('.closeformModal').click(function(e){
    e.preventDefault();
    let element = this.parentElement;
    // console.log(1);
    element.style.top = '0%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -110%)';
})


$('.closeModal').click(function(e){
    e.preventDefault();
    let element = this.parentElement.parentElement;
    element.style.top = '0%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -110%)';
})

function inputCheck(element, elementValue, type){
    // console.log(type);
    errMsgElement = element.parentElement.nextElementSibling;
    // console.log(errMsgElement);
    if(elementValue.trim() == 0){
        // message to be shown if the field is 0
        let errMsg = `Field cannot be empty`;
        errMsgElement.innerText = errMsg;
        errMsgElement.style.visibility = 'visible';
        return 0;
    }  
    else if(typeCheck(elementValue, type) == 0){
        // message to be shown if the type doesnt match
        let errMsg = `Field has to be a ${type}`;
        errMsgElement.innerText = errMsg;
        errMsgElement.style.visibility = 'visible';
        return 0;
    }
    else{
        let errMsg = `Error Message`;
        errMsgElement.value = errMsg;
        errMsgElement.style.visibility = 'hidden';
        return 1;
    }
}

// function typeCheck(elementValue, type){
//     if(type == 'string' && Number.isInteger(elementValue) == true){
//         return 0;
//     }
//     else if(type == 'number' && Number.isInteger(elementValue) == false){
//         return 0;
//     }
//     else{
//         return 1;
//     }
// }

function typeCheck(elementValue, type){
    if(type == 'string' && isNaN(elementValue) == false){
        return 0;
    }
    else if(type == 'number' && isNaN(elementValue) == true){
        return 0;
    }
    else{
        console.log('returned 1');
        return 1;
    }
}





// toggleBtn.addEventListener('change', function(){
//     if(this.checked){

//     }
//     else{

//     }
// })

launchContactForm.addEventListener('click',(e)=>{
    e.preventDefault();
    for(let i = 0; i < modal.length; i++){
        if(modal[i].id != contactForm.id){
            modal[i].style.top = `0%`;
            modal[i].style.transform = `translate(-50%, -110%)`;
            assetModalCounter = 0;
        }
    }
    if(contactModalCounter == 0){
        contactForm.style.top = `50%`;
        contactForm.style.transition = `all 0.4s ease-in-out 0s`;
        contactForm.style.transform = `translate(-50%, -50%)`;
        contactModalCounter = 1;
    }
    else if(contactModalCounter == 1){
        contactForm.style.top = `0%`;
        contactForm.style.transition = `all 0.4s ease-in-out 0s`;
        contactForm.style.transform = `translate(-50%, -110%)`;
        contactModalCounter = 0;
    }
})
launchRequestForm.addEventListener('click', (e)=>{
    e.preventDefault();
    // console.log(1);
    for(let i = 0; i < modal.length; i++){
        if(modal[i].id != assetForm.id){
            modal[i].style.top = `0%`;
            modal[i].style.transform = `translate(-50%, -110%)`;
            contactModalCounter = 0;
        }
    }
    if(assetModalCounter == 0){
        // console.log('there');
        assetFormFront.style.transform = 'perspective(600px) rotateY(0deg)';
        assetFormFront.style.transitiion = 'none';
        assetFormBack.style.transform = 'perspective(600px) rotateY(180deg)';
        assetFormBack.style.transitiion = 'none';
        assetForm.style.transition = `all 0.4s ease-in-out 0s`;
        assetForm.style.top = `50%`;
        assetForm.style.transform = `translate(-50%, -50%)`;
        assetModalCounter = 1;
    }
    else if(assetModalCounter == 1){
        // console.log('here');
        assetForm.style.top = `0%`;
        assetForm.style.transition = `all 0.4s ease-in-out 0s`;
        assetForm.style.transform = `translate(-50%, -110%)`;
        assetModalCounter = 0;
    }

})

