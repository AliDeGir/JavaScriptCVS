let csvInput = document.getElementById('csv-input');
let demoDiv = document.getElementById('demo-div');
let demoBack = document.getElementById('demo-container');
let select1 = document.getElementById('select1');
let select2 = document.getElementById('select2');

demoDiv.innerHTML = 'Welcome!' +
    '<br>Please choose a CSV file and upload';


csvInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    
    select2.selectedIndex = null;

    document.getElementById('select-container').classList.remove('hidden');
    demoBack.style.background="yellow";

    demoDiv.innerHTML = 'Thanks!' +
    '<br>Now select a contract type to limit search';

    Papa.parse(file, {
        header: true,
        complete: (results) => {
            const rawData = results.data;
            console.log(`Count of files: ${rawData.length}`);

            // TESTING FUNCTION FILTERING/CREATING LIST......

            let conTypeList = ['- Select a contract type -'];

            rawData.forEach((row) => {
                conTypeList.push(row.Ansattforhold);
            })

            let contractList = conTypeList.filter((element, index) => {
                return conTypeList.indexOf(element) === index;
            });

            for (let i = 0; i < contractList.length; i++) {
                let opt = document.createElement('option');
                opt.value = contractList[i];
                opt.innerHTML = contractList[i];
                select1.appendChild(opt);
            };

            select1.addEventListener('change', (event) => {
                document.getElementById('select2-div').classList.remove('hidden');
                let selectedOpt = event.target.value;
                console.log(selectedOpt);

                let matchedContractList = [];

                rawData.forEach((row) => {
                    if (row.Ansattforhold == selectedOpt) {
                        matchedContractList.push(row);
                    }
                });

                // console.log(matchedContractList)

                
                let matchedNameList = ['-  Select a name  -'];
                matchedContractList.forEach((row) => {
                    matchedNameList.push(row.PERSON_NAME);
                });

                // console.log(matchedNameList);
                
                let nameList = matchedNameList.filter((element, index) => {
                    return matchedNameList.indexOf(element) === index;
                });

                // console.log(nameList);

                
                for (let i = 0; i < nameList.length; i++) {
                    let opt = document.createElement('option');
                    opt.value = nameList[i];
                    opt.innerHTML = nameList[i];
                    select2.appendChild(opt);
                };

                demoDiv.innerHTML = 'Thanks!' +
                '<br>Now select a name to limit search';

                select2.addEventListener('change', (event) => {
                    selectedName = event.target.value;
                    console.log(selectedName)
                    demoDiv.innerHTML = 'Selected name is:' +
                    '<br>' + selectedName

                    let employeeData = []
                    rawData.forEach((row) => {
                        if (selectedName == row.PERSON_NAME) {
                            employeeData.push(row);
                        };
                    });

                    // console.log(employeeData);
                    demoDiv.innerHTML = 'Selected name is:' +
                    '<br>' + selectedName +
                    '<br>Count of activity periods: ' + employeeData.length

                    console.log(employeeData[0])
                    console.log(Object.keys(employeeData[0]))

                    // CREATE MONTH DETECTION -ONGOING PROCESS
                    
                    


                    // ----------------------------

                    

                    let activeMonthsArray = [];

                    // Access obj value with index
                    employeeData.forEach((row) => {
                        keysArray = Object.keys(row)
                        keyToAccess = keysArray[6]
                        valueToAccess = row[keyToAccess]
                        // console.log(valueToAccess)
                        activeMonthsArray.push(valueToAccess)
                    })

                    console.log(`Active months: ${activeMonthsArray}`)

                    // key = ["PAYROLL PERIOD"];

                    // for (let i = 0; i < monthsArray.length; i++) {
                    //     if (monthsArray[i] == employeeData[i].PAYROLL_PERIOD) {
                    //         activeMonths.push(employeeData[i]);
                    //     };
                    // };
                    // for (val of monthsArray) {
                    //     key = "PAYROLL PERIOD";
                    //     if (val == employeeData.forEach((row) => row.key)) {
                    //         activeMonths.push(row);
                    //     } else {
                    //         row = {['PAYROLL PERIOD']:val, ['Summer av Normal timer']:0, ['Summer av Overtids timer']:0, ['Summer av Normal timer + Overtids timer']:0};
                    //         activeMonths.push(row)
                    //     };
                    // };

                    // add month check
                });

                

                // debug here, matched name list empty

                

            })
        }
    })
})