$(document).ready(function(){
    if(sessionStorage.getItem('sessionVar') != 'pass'){
        window.location.href = `./index.html`;
    }
    else{

        let logout = document.getElementById('logoutBtn');
    logout.addEventListener('click', ()=>{
        $.post(
            "http://127.0.0.1:3000/logout",
            {
                userMail : sessionStorage.getItem('userMail')
            },
            function(result){
                sessionStorage.setItem('sessionVar', null);
                window.location.href = `./index.html`;
            }
        )
    });

        let totalAlerts = document.querySelector('.totalAlerts .cardValue');
        let pendingAlerts = document.querySelector('.pendingAlerts .cardValue');
        let alertsApproved = document.querySelector('.alertsOveridden .cardValue');
        let tableHolder = document.querySelector('.tableHolder');

    
        setData(totalAlerts);
        totalAlertsCard(tableHolder);

        setInterval(function(){
            setData(totalAlerts);
        }, 2000);
        setInterval(function(){
            totalAlertsCard(tableHolder);
        }, 2000);

        let totalCard = document.getElementById('total');

        totalCard.addEventListener('click', ()=>{
            totalAlertsCard(tableHolder);
        })
    }
});

function setData(param1){
    $.post(
        "http://127.0.0.1:3000/alertCard",
        {
            userDept : sessionStorage.getItem('userDept')
        },
        function(result){
            param1.innerText = result;
        }
    )
}


function totalAlertsCard(param){
    console.log(sessionStorage.getItem('userDept'));
    $.post(
        "http://127.0.0.1:3000/totalAlertsTable",
        {
            userDept : sessionStorage.getItem('userDept')
        },
        function(result){
            let arr = ['alert id','reader id','tag id','location name','allert status','alert','room name', 'date', 'time', 'alert description'];
            let element =  document.querySelector('table');
            element.remove();
            let table = document.createElement('table');
            table.className = 'dynamicTable';
            let thead = document.createElement('thead');
            let tbody = document.createElement('tbody');
            let tr = document.createElement('tr');

            for(let i = 0; i<arr.length; i++){
                let th = document.createElement('th');
                th.innerText = arr[i];
                tr.appendChild(th);
            }
            thead.append(tr);

            for(let x in result){
                let row = tbody.insertRow(x);
                for(let i = 0; i < Object.values(result[x]).length; i++){
                    row.insertCell(i).innerText = Object.values(result[x])[i];
                } 
            }
            table.append(thead);
            table.append(tbody);
            param.append(table); 
        }
    )
}