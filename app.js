let csvInput = document.getElementById('csv-input');
let demoDiv = document.getElementById('demo-div');
let demoBack = document.getElementById('demo-container');
let select1 = document.getElementById('select1');
let select2 = document.getElementById('select2');

demoDiv.innerHTML = 'Welcome!' +
    '<br>Please choose a CSV file and upload';

csvInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    // try to reset selectors after new file uploaded
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

            // Add another evetlistener before contract type selector to determine ground staff on each dept or contract type
            // Choose dept_no
            // Filter dept_no
            // Get all emp_no connected to that site, % and type of contract on each emp_no
            // Show above info
            // Turn name filtering to a function???

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
                console.log(`Selected contract type: ${selectedOpt}`);

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

                    // CREATE MONTH DETECTION -ONGOING PROCESS
                    let monthsArray = ['Jan-22', 'Feb-22','Mar-22', 'Apr-22', 'May-22', 'Jun-22', 'Jul-22', 'Aug-22', 'Sep-22', 'Oct-22', 'Nov-22', 'Dec-22', 'Jan-23', 'Feb-23', 'Mar-23'];
                    
                    let resultArr = [];
                    for (let i = 0; i < monthsArray.length; i++) {
                        let found = false;
                        
                        for (let j = 0; j < employeeData.length; j++) {
                            if (employeeData[j]["PAYROLL PERIOD"] === monthsArray[i]) {
                                employeeData[j]["hasWorked"] = true;
                                resultArr.push(employeeData[j]);
                                found = true;
                                break
                            }
                        }
                        if (!found) {
                            let emptyObj = {};

                            Object.keys(employeeData[0]).forEach(key => {
                                if (key === "Summer av Normal timer") {
                                    emptyObj[key] = 0;
                                }
                                else if (key === "Summer av Overtids timer") {
                                    emptyObj[key] = 0;
                                }
                                else if (key === "Summer av Normal timer + Overtids timer") {
                                    emptyObj[key] = 0;
                                }
                                else if (key === "PAYROLL PERIOD") {
                                    emptyObj[key] = monthsArray[i];
                                }
                                else {
                                    emptyObj[key] = employeeData[0][key];
                                }
                            });
                            resultArr.push(emptyObj);
                        }
                    }
                    // console.log(resultArr);

                    let lastMonthsCount = 0;
                    let workedHoursSum = 0;

                    resultArr.forEach((row) => {
                        decimalHours = parseFloat(row["Summer av Normal timer + Overtids timer"]);
                        
                        workedHoursSum += parseFloat(row["Summer av Normal timer + Overtids timer"])
                        // console.log(`Worked hours sum: ${workedHoursSum} - Hours to add: ${row["Summer av Normal timer + Overtids timer"]} - Decimal: ${decimalHours.toFixed(1)}`)
                        if (row["PAYROLL PERIOD"] == "Jan-23"||row["PAYROLL PERIOD"] == "Feb-23"||row["PAYROLL PERIOD"] == "Mar-23") {
                            lastMonthsCount++;
                            if (lastMonthsCount >= 2) {
                                row["isActive"] = true;
                            }
                        }
                    });
                    
                    let averagePerMonth = parseFloat(workedHoursSum) / parseFloat(employeeData.length)
                    // console.log(`Worked hours: ${workedHoursSum} - Active months: ${employeeData.length} - Average: ${averagePerMonth.toFixed(1)}`)
                    let lastMessage = "Chosen employee: " + selectedName +
                    "<br>Contract type: " + selectedOpt +
                    "<br>Active months: " + employeeData.length +
                    "<br>Worked total hours: " + workedHoursSum +
                    "<br>Average of: " + averagePerMonth.toFixed(1) + "%";
                    demoDiv.innerHTML = lastMessage

                    // sum worked hours and avarage for worked months. decimals not working. DEBUG!!!!
                });
            })
        }
    })
})