// panelSelector - 1 - Movement requests panel
// panelSelector - 2 - Access requests panel

// tableSelector - 1 - total requests
// tableSelector - 2 - pending requests
// tableSelector - 3 - approved requests
// tableSelector - 4 - denied requests 

if(sessionStorage.getItem('sessionVar') != 'pass'){
    window.location.href = './index.html';
}
else{
    let totalMovementRequests = document.getElementById('mTotalRequests');
    let pendingMovementRequests = document.getElementById('mPendingRequests');
    let approvedMovementRequests = document.getElementById('mApprovedRequests');
    let deniedMovementRequests = document.getElementById('mDeniedRequests');

    let totalAccessRequests = document.getElementById('aTotalRequests');
    let pendingAccessRequests = document.getElementById('aPendingRequests');
    let approvedAccessRequests = document.getElementById('aApprovedRequests');
    let deniedAccessRequests = document.getElementById('aDeniedRequests');

    let viewAllMovementRequests = document.getElementById('mTotal');
    let viewPendingMovementRequests = document.getElementById('mPending');
    let viewApprovedMovementRequests = document.getElementById('mApproved');
    let viewDeniedMovementRequests = document.getElementById('mDenied');

    let viewAllAccessRequests = document.getElementById('aTotal');
    let viewPendingAccessRequests = document.getElementById('aPending');
    let viewApprovedAccessRequests = document.getElementById('aApproved');
    let viewDeniedAccessRequests = document.getElementById('aDenied');

    let requestTiles = document.querySelectorAll('.subSec');

    let tableHolder = document.getElementById('tableHolder');

    let logout = document.getElementById('logoutBtn');

    let panelSelector = 1; 
    let tableSelector = 1;


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


    setCards(
        totalMovementRequests, pendingMovementRequests, approvedMovementRequests, deniedMovementRequests,
        totalAccessRequests, pendingAccessRequests, approvedAccessRequests, deniedAccessRequests
    );

    $.post(
        'http://127.0.0.1:3000/totalMovementRequests',
        {
            userDept : sessionStorage.getItem('userDept')
        },
        function(result){
            panelSelector = 1;
            tableSelector = 1;
            renderTable(panelSelector, tableSelector, result);
        }
    )

    viewAllMovementRequests.addEventListener('click', ()=>{
        tileColor(this);
        $.post(
            'http://127.0.0.1:3000/totalMovementRequests',
            {
                userDept : sessionStorage.getItem('userDept')
            },
            function(result){
                panelSelector = 1;
                tableSelector = 1;
                renderTable(panelSelector, tableSelector, result);
            }
        )
    });
    viewPendingMovementRequests.addEventListener('click', ()=>{
        tileColor(this);
        $.post(
            'http://127.0.0.1:3000/pendingMovementRequests',
            {
                userDept : sessionStorage.getItem('userDept')
            },
            function(result){
                panelSelector = 1;
                tableSelector = 2;
                renderTable(panelSelector, tableSelector, result);
            }
        )
    })
    viewApprovedMovementRequests.addEventListener('click',()=>{
        tileColor(this);
        $.post(
            'http://127.0.0.1:3000/approvedMovementRequests',
            {
                userDept : sessionStorage.getItem('userDept')
            },
            function(result){
                panelSelector = 1;
                tableSelector = 3;
                renderTable(panelSelector, tableSelector, result);
            }
        )
    })
    viewDeniedMovementRequests.addEventListener('click', ()=>{
        tileColor(this);
        $.post(
            'http://127.0.0.1:3000/deniedMovementRequests',
            {
                userDept : sessionStorage.getItem('userDept')
            },
            function(result){
                panelSelector = 1;
                tableSelector = 4;
                renderTable(panelSelector, tableSelector, result);
            }
        )
    })
    viewAllAccessRequests.addEventListener('click', ()=>{
        tileColor(this);
        $.post(
            'http://127.0.0.1:3000/totalAccessRequests',
            {
                userDept : sessionStorage.getItem('userDept')
            },
            function(result){
                panelSelector = 2;
                tableSelector = 1;
                renderTable(panelSelector, tableSelector, result);
            }
        )
    })
    viewPendingAccessRequests.addEventListener('click',()=>{
        tileColor(this);
        $.post(
            'http://127.0.0.1:3000/pendingAccessRequests',
            {
                userDept : sessionStorage.getItem('userDept')
            },
            function(result){
                console.log(result);
                panelSelector = 2;
                tableSelector = 2;
                renderTable(panelSelector, tableSelector, result);
            }
        )
    })
    viewApprovedAccessRequests.addEventListener('click',()=>{
        tileColor(this);
        $.post(
            'http://127.0.0.1:3000/approvedAccessRequests',
            {
                userDept : sessionStorage.getItem('userDept')
            },
            function(result){
                panelSelector = 2;
                tableSelector = 3;
                renderTable(panelSelector, tableSelector, result);
            }
        )
    })
    viewDeniedAccessRequests.addEventListener('click', ()=>{
        tileColor(this);
        $.post(
            'http://127.0.0.1:3000/deniedAccessRequests',
            {
                userDept : sessionStorage.getItem('userDept')
            },
            function(result){
                panelSelector = 2;
                tableSelector = 4;
                renderTable(panelSelector, tableSelector, result);
            }
        )
    })

    setInterval(function(){
        setCards(
            totalMovementRequests, pendingMovementRequests, approvedMovementRequests, deniedMovementRequests,
            totalAccessRequests, pendingAccessRequests, approvedAccessRequests, deniedAccessRequests
        );
    }, 5000);

    function tileColor(element){
        for(let i = 0; i < requestTiles.length; i++){
            if(requestTiles[i].id == element.id){
                requestTiles[i].style.backgroundColor = 'purple';
            }
            else{
                requestTiles[i].style.backgroundColor = '#fff';
            }
        }
    }        
    function setCards(ele1, ele2, ele3, ele4, ele5, ele6, ele7, ele8){
        $.post(
            'http://127.0.0.1:3000/reqCards',
            {
                userDept : sessionStorage.getItem('userDept')
            },
            function(result){
                ele1.innerText = result[0];
                ele2.innerText = result[1];
                ele3.innerText = result[2];
                ele4.innerText = result[3];

                ele5.innerText = result[4];
                ele6.innerText = result[5];
                ele7.innerText = result[6];
                ele8.innerText = result[7];

            }
        )
    }

    function renderTable(panelSelector, tableSelector, result){

        let tableElement = document.querySelector('table');
        tableElement.remove();

        let arr1 = ['Serial no.', 'asset id', 'starting point', 'destination', 'date', 'time', 'custodian name', 'custodian id', 'requestor name', 'requestor id', 'request status', 'Actions'];
        let arr2 = ['Serial no.', 'asset id', 'starting point', 'destination', 'date', 'time', 'custodian name', 'custodian id', 'requestor name', 'requestor id', 'request status'];
        let arr3 = ['Serial no.','applicant name', 'applicant id', 'email', 'date', 'contact', 'request status', 'Actions'];
        let arr4 =  ['Serial no.','applicant name', 'applicant id', 'email', 'date', 'contact', 'request status'];

        let arr = [];

        if(panelSelector == 1 && tableSelector == 2){
            arr = arr1;
        }
        else if(panelSelector == 1 && tableSelector != 2){
            arr = arr2;
        }
        else if(panelSelector == 2 && tableSelector == 2){
            arr = arr3;
        }
        else if(panelSelector == 2 && tableSelector != 2){
            arr = arr4;
        }

        let table = document.createElement('table');
        table.className = 'dynamicTable';
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        let tr = document.createElement('tr');

        for(let i = 0; i < arr.length; i++){
            let th = document.createElement('th');
            th.innerText = arr[i];
            tr.appendChild(th);
        }
        thead.append(tr);

        for(let x in result){
            let row = tbody.insertRow(x);
            let data = Object.values(result[x]);

            for(let i = 0; i < data.length; i++){
                row.insertCell(i).innerText = data[i];
            }
            if(tableSelector == 2){
                let btn1 = document.createElement('button');
                let btn2 = document.createElement('button');
                
                btn1.className = 'approve'
                btn1.innerText = 'Approve';

                btn2.className = 'deny';
                btn2.innerText = 'Deny';

                row.insertCell(data.length).append(btn1, btn2);
            }
        }
            table.append(thead);
            table.append(tbody);
            tableHolder.append(table);
            approveButton();
            denyButton();
    }

    function approveButton(){
        $('.approve').click(function(){
            this.nextElementSibling.style.display = 'none';

            if(panelSelector == 1){
                let serial = this.parentElement.parentElement.children[0].innerText;
                let id = this.parentElement.parentElement.children[1].innerText;
                let start = this.parentElement.parentElement.children[2].innerText;
                let destination = this.parentElement.parentElement.children[3].innerText;
                let empID = this.parentElement.parentElement.children[9].innerText;

                console.log(serial);
                console.log(id);
                console.log(start);
                console.log(destination);
                console.log(empID);

                $.post(
                    'http://127.0.0.1:3000/mAppr',
                    {
                        reqID : id,
                        reqSerial : serial,
                        start : start,
                        dest : destination,
                        empID : empID
                    },
                    function(result){
                        setCards(
                            totalMovementRequests, pendingMovementRequests, approvedMovementRequests, deniedMovementRequests,
                            totalAccessRequests, pendingAccessRequests, approvedAccessRequests, deniedAccessRequests
                        );
                    }
                )
            }
            else if(panelSelector == 2){
                let serial = this.parentElement.parentElement.children[0].innerText;
                let userName = this.parentElement.parentElement.children[1].innerText;
                let id = this.parentElement.parentElement.children[2].innerText;
                let email = this.parentElement.parentElement.children[3].innerText;

                $.post(
                    'http://127.0.0.1:3000/aAppr',
                    {
                        reqID : id,
                        reqSerial : serial,
                        userName : userName,
                        email : email
                    },
                    function(result){
                        setCards(
                            totalMovementRequests, pendingMovementRequests, approvedMovementRequests, deniedMovementRequests,
                            totalAccessRequests, pendingAccessRequests, approvedAccessRequests, deniedAccessRequests
                        );
                    }
                )
            }
        })
    }

    function denyButton(){
        $('.deny').click(function(){
            this.previousElementSibling.style.display = 'none';
            if(panelSelector == 1){
                let serial = this.parentElement.parentElement.children[0].innerText;
                let id = this.parentElement.parentElement.children[1].innerText;
                console.log(serial);
                console.log(id);

                $.post(
                    'http://127.0.0.1:3000/mdeny',
                    {
                        reqID : id,
                        reqSerial : serial
                    },
                    function(result){
                        setCards(
                            totalMovementRequests, pendingMovementRequests, approvedMovementRequests, deniedMovementRequests,
                            totalAccessRequests, pendingAccessRequests, approvedAccessRequests, deniedAccessRequests
                        );
                    }
                )
            }
            else if(panelSelector == 2){
                let serial = this.parentElement.parentElement.children[0].innerText;
                let id = this.parentElement.parentElement.children[2].innerText;

                $.post(
                    'http://127.0.0.1:3000/adeny',
                    {
                        reqID : id,
                        reqSerial : serial
                    },
                    function(result){
                        setCards(
                            totalMovementRequests, pendingMovementRequests, approvedMovementRequests, deniedMovementRequests,
                            totalAccessRequests, pendingAccessRequests, approvedAccessRequests, deniedAccessRequests
                        );
                    }
                )
            }
        })
    }
}