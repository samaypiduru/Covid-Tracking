window.onload = () => {
    fetchAllData();
}

function fetchAllData() {
    fetchUSData();
    fetchStatesData();

    // fetches data every 12 hours 
    setTimeout(fetchAllData, 43200000);
}

function fetchUSData() {
	fetch('https://api.covidtracking.com/v1/us/current.json')
	.then(resp => resp.json())
	.then(usData => {
        let lastUpdate = new Date(usData[0].lastModified);

        let totalCases = usData[0].positive;
        let recoveries = usData[0].recovered;
        let totalDeaths = usData[0].death;
        let testPos = usData[0].positive;
        let testPosInc = usData[0].positiveIncrease;
        let testNeg = usData[0].negative;
        let testNegInc = usData[0].negativeIncrease;
        let totalTests = usData[0].totalTestResults;
        let totalTestInc = usData[0].totalTestResultsIncrease;
        let pendTest = usData[0].pending;
        let totalHosp = usData[0].hospitalizedCumulative;
        let currentHosp = usData[0].hospitalizedCurrently;
        let hospInc = usData[0].hospitalizedIncrease;
        let needICU = usData[0].inIcuCurrently;
        let needVent = usData[0].onVentilatorCurrently;

        //  main info data
        document.getElementById('cases').innerHTML = "Cases<br>" + totalCases.toLocaleString('en');
        document.getElementById('recovered').innerHTML = "Recovered<br>" + recoveries.toLocaleString('en');
        document.getElementById('deceased').innerHTML = "Deceased<br>" + totalDeaths.toLocaleString('en');

        //  testing data
        document.getElementById('totalTests').innerHTML = "Total Tests<br>" + totalTests.toLocaleString('en');
        document.getElementById('testInc').innerHTML = " Testing<br>▲ " + totalTestInc.toLocaleString('en');
        document.getElementById('pendTest').innerHTML = "Pending Tests<br>" + pendTest.toLocaleString('en');
        document.getElementById('testingNeg').innerHTML = "Negative Tests<br>" + testNeg.toLocaleString('en') + 
        "<br>▲ " + testNegInc.toLocaleString('en');
        document.getElementById('testingPos').innerHTML = "Positive Tests<br>" + testPos.toLocaleString('en') + 
        "<br>▲ " + testPosInc.toLocaleString('en');

        // patient healthcare data
        document.getElementById('totalHosp').innerHTML = "Patients Hospitalized<br>" + totalHosp.toLocaleString('en');
        document.getElementById('currentHosp').innerHTML = "Currently Hospitalized<br>" + currentHosp.toLocaleString('en');
        document.getElementById('hospInc').innerHTML = "▲ " + hospInc.toLocaleString('en');
        document.getElementById('needICU').innerHTML = "Patients in Intensive Care Unit<br>" + needICU.toLocaleString('en');
        document.getElementById('needVent').innerHTML = "Patients on Ventilator<br>" + needVent.toLocaleString('en');

        document.getElementById('updateTime').innerHTML = "Last Updated: " + lastUpdate.toString().substring(0, 33);

	})
	.catch(function() {
		console.log("error: cannot fetch US data");
    })
}

function fetchStatesData() {
    fetch('https://api.covidtracking.com/v1/states/current.json')
	.then(resp => resp.json())
	.then(stateData => {
        let stateAbbr = [];
        let stateRecovs = [];
        let stateCases = [];
        let stateDeaths = [];
        let stateDataQual = [];
        let rankColor = [];

        for(let i = 0; i < stateData.length; i++) {     // checks for null values before adding to the arrays
            stateData[i].state!==null ? stateAbbr.push(stateData[i].state) : stateAbbr.push("-");
            stateData[i].recovered!==null ? stateRecovs.push(stateData[i].recovered) : stateRecovs.push("-");
            stateData[i].positiveCasesViral!==null ? stateCases.push(stateData[i].positiveCasesViral) : stateCases.push("-");
            stateData[i].death!==null ? stateDeaths.push(stateData[i].death) : stateDeaths.push("-");
            stateData[i].dataQualityGrade!==null ? stateDataQual.push(stateData[i].dataQualityGrade) : stateDataQual.push("-");

            switch(stateDataQual[i].substring(0,1)) {   // assigns a color to each data ranking (more interactive ui)
                case "A": rankColor.push("green"); break;
                case "B": rankColor.push("greenyellow"); break;
                case "C": rankColor.push("yellow"); break;
                case "D": rankColor.push("orange"); break;
                default: rankColor.push("red");
            }
        }

        for(let i = 0; i < stateData.length; i++) {
            document.getElementById("statesList").innerHTML += 
            '<div class="listItem" style="padding:10px;">' + 
                "<div class='state'>" + stateAbbr[i].toLocaleString('en') + "</div>" + 
                "<div class='recovered'>" + stateRecovs[i].toLocaleString('en') + "</div>" + 
                "<div class='cases'>" + stateCases[i].toLocaleString('en') + "</div>" + 
                "<div class='deceased'>" + stateDeaths[i].toLocaleString('en') + "</div>" + 
                '<div class="dataQual" style="color:' + rankColor[i] + ';">' + stateDataQual[i] + "</div>" + 
            '</div>';
        }
	})
	.catch(function() {
		console.log("error: cannot fetch States data");
	})
}