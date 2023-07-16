let csvInput = document.getElementById('csv-input');
let demoDiv = document.getElementById('demo-div');
let demoBack = document.getElementById('demo-container');
let select1 = document.getElementById('select1');
let select2 = document.getElementById('select2');
let select3 = document.getElementById('select3');

demoDiv.innerHTML = 'Welcome!' +
'<br>' +
'<br>Please choose a CSV file and upload';

csvInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    // try add reset for selectors
    document.getElementById('select1-div').classList.remove('hidden');

    demoDiv.innerHTML = 'Thanks!' +
    '<br>' +
    '<br>Now select a mission type';

    Papa.parse(file, {
        header: true,
        complete: (results) => {
            const rawData = results.data;
            console.log(`Counts of objects in CSV file: ${rawData.length}`)

            // creating first selector values
            let missionSelectorList = [' - Select a mission - ', 'Search by contract type', 'Search by name', 'Search site employements'];
            for (let i = 0; i < missionSelectorList.length; i++) {
                let opt = document.createElement('option');
                opt.value = missionSelectorList[i];
                opt.innerHTML = missionSelectorList[i];
                select1.appendChild(opt)
            }

            select1.addEventListener('change', (event) => {
                let select1_val = event.target.value;
                demoDiv.innerHTML = 'Thanks!' +
                '<br>' +
                '<br>You selected: ' + select1_val
                
                document.getElementById('select2-div').classList.remove('hidden');
                console.log(`Choice from selected 1 ${select1_val}`);
                if (select1_val === 'Search by contract type') {
                    document.getElementById('select2-text').innerHTML = 'Select a contract type'
                    // already created
                } 
                else if (select1_val === 'Search by name') {
                    document.getElementById('select2-text').innerHTML = 'Select a name'
                    // create name search
                } 
                else if (select1_val === 'Search site employements') {
                    document.getElementById('select2-text').innerHTML = 'Select a site number'
                    
                    // create site number search and ground employement
                    // creating function
                    let filteredSiteList = matchFilter(rawData, "DEPT_NO");
                    // --------------------

                    filteredSiteList.sort(function(a, b){return a-b})
                    demoDiv.innerHTML = 'Facts!' +
                    '<br>Count of sites in Sodexo food: ' + filteredSiteList.length
                    console.log(`Count of sites: ${filteredSiteList.length}`)

                    for (let i = 0; i < filteredSiteList.length; i++) {
                        let opt = document.createElement('option');
                        opt.value = filteredSiteList[i];
                        opt.innerHTML =filteredSiteList[i];
                        select2.appendChild(opt)
                    }
                    select2.addEventListener('change', (event) => {
                        let select2_val = event.target.value;

                        // adding function
                        let matchedSiteList = matchIfCond(rawData, 'DEPT_NO', select2_val)

                        // ----------------------------

                        console.log(`Count of matched sites: ${matchedSiteList.length}`)

                        // get names from matched site list
                        // adding function
                        let filteredMatchedNameList = matchFilter(matchedSiteList, 'PERSON_NAME')

                        // ---------------------
                        
                        console.log(`Count of employee on site ${select2_val} is: ${filteredMatchedNameList.length}`)
                        // count names and get employement info (contract type, percent etc...)
                        // select a name from name list
                        // get employee data from selected name
                        let empOnSiteData = []
                        console.log(matchedSiteList)

                        // rawData.forEach((row) => {
                        //     if (row['DEPT_NO'] === select2_val) {
                        //         empOnSiteData.push(row)
                        //     }
                        // })

                        // for (let i of filteredMatchedNameList) {
                        //     console.log(i)
                        // }
                    })
                    
                    
                }
            })

            
        }
    });
});

function matchFilter(list, matchword) {
    let storage = []
    list.forEach((row) => {
        storage.push(row[matchword])
    });
    let unique = [...new Set(storage)]
    return unique;
};

function matchIfCond(obj, word, input) {
    let bag = [];
    obj.forEach((row) => {
        if (row[word] === input) {
            bag.push(row)
        }
    });
    return bag;
}