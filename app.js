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
                console.log(`Selected contract typr: ${selectedOpt}`);

                let matchedContractList = [];

                rawData.forEach((row) => {
                    if (row.Ansattforhold == selectedOpt) {
                        matchedContractList.push(row);
                    }
                });
                
                let matchedNameList = ['-  Select a name  -'];
                matchedContractList.forEach((row) => {
                    matchedNameList.push(row.PERSON_NAME);
                });
                
                let nameList = matchedNameList.filter((element, index) => {
                    return matchedNameList.indexOf(element) === index;
                });
                
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
                    console.log(`Selected name: ${selectedName}`)
                    demoDiv.innerHTML = 'Selected name is:' +
                    '<br>' + selectedName

                    let employeeData = []
                    rawData.forEach((row) => {
                        if (selectedName == row.PERSON_NAME) {
                            employeeData.push(row);
                        };
                    });

                    demoDiv.innerHTML = 'Selected name is:' +
                    '<br>' + selectedName +
                    '<br>Count of activity periods: ' + employeeData.length

                    console.log(employeeData)

                    // CREATE MONTH DETECTION -ONGOING PROCESS
                    let monthsArray = ['Jan-22', 'Feb-22','Mar-22', 'Apr-22', 'May-22', 'Jun-22', 'Jul-22', 'Aug-22', 'Sep-22', 'Oct-22', 'Nov-22', 'Dec-22', 'Jan-23', 'Feb-23', 'Mar-23'];
                    
                    let resultArr = [];
                    for (let i = 0; i < monthsArray.length; i++) {
                        let found = false;
                        
                        for (let j = 0; j < employeeData.length; j++) {
                            if (employeeData[j]["PAYROLL PERIOD"] === monthsArray[i]) {
                                // console.log(employeeData[j])
                                resultArr.push(employeeData[j]);
                                found = true;
                                break
                            }
                        }
                        if (!found) {
                            let emptyObj = { "PAYROLL PERIOD": monthsArray[i] };

                            Object.keys(employeeData[0]).forEach(key => {
                                if (key !== "PAYROLL PERIOD") {
                                    emptyObj["Summer av Normal time"] = 0;
                                    emptyObj["Summer av Overtids timer"] = 0;
                                    emptyObj["Summer av Normal timer + Overtids timer"] = 0;
                                }
                            });
                            resultArr.push(emptyObj);
                        }
                    }
                    console.log(resultArr)
                    // try get each value of object to create missing months
                    // add month check for last 3 months worked
                    // add departments basic apployment 
                });
            })
        }
    })
})