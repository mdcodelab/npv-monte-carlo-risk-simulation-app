//capture the project life in years from the user
const description = document.querySelector(".description");
const text = document.querySelector(".text");
const form__1 = document.querySelector(".form__1");
const table = document.querySelector(".table");


form__1.addEventListener("submit", (e) => {
    e.preventDefault();
    let num = parseFloat(number.value); //number of years
    
    if (num === 0 || !num) {
        text.innerText = "Please insert the number of years of the project's life!"
    } else {
        text.innerText = "Now, please insert annual revenues and expenses in your currency!";
        description.style.top = "240px";
    }

    function generateRows(x) {
        return table.innerHTML += `<tr class="tr"><td>${x}</td>
                <td><input type="number" id="r${x}" placeholder="Revenue year ${x}" class="input" name="revenues"></input></td> 
                <td><input type="number" id="e${x}" placeholder="Expenditure year ${x}" class="input" name="expenditures"></input></td></tr>`
    }

    for (let i = 0; i < num; i++) {
        generateRows(i + 1);
    }


    document.getElementById("number").disabled = true;
    document.querySelector(".btn__1").disabled = true;
})



//capture the revenues, the expenditures, the initial investment, the cost of capital and the tax rate

const form__2 = document.querySelector(".form__2");

form__2.addEventListener("submit", (e) => {
    e.preventDefault();

    //get inputs with name "revenues" & "expenses"
    let inputs_revenues = document.getElementsByName("revenues");
   // console.log(inputs_revenues);

    let inputs_expenditures = document.getElementsByName("expenditures");
    //console.log(inputs_expenditures);

    //get the values
    let revenues = [];
    let expenditures = [];
    for (let i = 0; i < inputs_revenues.length; i++) {
        let input_revenue_value = parseFloat(inputs_revenues[i].value);
        let input_expenditure_value = parseFloat(inputs_expenditures[i].value);

        if (inputs_revenues[i].value) {revenues.push(input_revenue_value);}

        if (inputs_expenditures[i].value) {expenditures.push(input_expenditure_value);}
    }
    console.log(revenues);
    console.log(expenditures);

    //get the initial investment
    const investment = parseFloat(document.getElementById("investment").value);
    console.log(investment);

    //get the cost of capital
    const k = parseFloat(document.getElementById("capital").value) / 100;
    console.log(k);

    //get the tax rate
    const tax = parseFloat(document.getElementById("tax").value) / 100;
    console.log(tax);


    //calculate the NPV
    function calcNPV() {
        let npv;
        let income = 0
        for (let i = 0; i < revenues.length; i++) {
            if (revenues[i] > expenditures[i]) {
                let annual_income = (((revenues[i] - expenditures[i]) * (1 - tax) 
                + tax*investment / revenues.length))/ (Math.pow(1 + k, i + 1));
                income += annual_income;
            } else {
                let new_income = (investment / revenues.length) / Math.pow(1 + k, i + 1);
                income += new_income;
            }
        }
        npv = income - investment;
        return npv.toFixed(2);
    }


    //Monte Carlo simulation
    //The Box-Muller transform converts two independent uniform variates on (0, 1) into 
    //two standard Gaussian variates (mean 0, variance 1).

    function random_val() {
        let u = 1 - Math.random(); //Converting [0,1) to (0,1)
        let v = Math.random();
        let result = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return result;
    }
    console.log(random_val());


    //NPV - normal distribution (mean 0) 
    //let riskNPV;
    // function randomNPV() {
    //     let annual_income=0;
    //     let annual_income_risk;
    //     for (let i = 0; i < revenues.length; i++) {

    //         if (revenues[i] > expenditures[i]) {
    //             annual_income_risk = ((revenues[i]*random_val() - expenditures[i]*random_val()) * (1 - tax) 
    //             + investment/ revenues.length)/Math.pow(1 + k, i + 1);
    //         } else {
    //             annual__income_risk = (investment / revenues.length) / Math.pow(1 + k, i + 1);
    //         }
    //         annual_income += annual_income_risk;
    //     }

    //     riskNPV = annual_income - investment;

    //     return riskNPV;
    // }
    // console.log(randomNPV());


    //I use here uniform distribution
    function randomNPV_unif() {
        let annual_income = 0;
        let annual_income_risk;
        for (let i = 0; i < revenues.length; i++) {

            if (revenues[i] > expenditures[i]) {
                annual_income_risk = ((revenues[i] * Math.random() - expenditures[i] * Math.random()) * (1 - tax)
                    + investment / revenues.length) / Math.pow(1 + k, i + 1);
            } else {
                annual_income_risk = (investment / revenues.length) / Math.pow(1 + k, i + 1);
            }
            annual_income += annual_income_risk;
        }

        riskNPV = annual_income - investment;

        return riskNPV;
    }
    console.log(randomNPV_unif());


    //calculate probability & mean
    let npv_positive = [];
    let npv_all = [];
    let npv_all_sum = 0;
    let mean = 0;

    function probabilityFunc() {
        //npv at risk (positive and negative)
        for (let i = 0; i < 99999; i++) {
            let npvs = randomNPV_unif();
            npv_all.push(npvs);  //total npvs array

            npv_all_sum += npv_all[i]; //sum of all npv to calculate the mean

            //npv positive
            if (npv_all[i] > 0) { npv_positive.push(npv_all[i]) }  // npvs_positive array
        }
        let p = npv_positive.length * 100 / npv_all.length;  //calculate the probability

        return p
    }

    //console.log(probabilityFunc());

    function meanFunc() {
        //npv at risk (positive and negative)
        for (let i = 0; i < npv_all.length; i++) {
            npv_all_sum += npv_all[i]; //sum of all npv to calculate the mean
        }

        mean = npv_all_sum / npv_all.length;

        return mean;
    }

    //console.log(meanFunc());
    if (revenues.length !== 0 && expenditures.length !== 0 && investment && k && tax) {
        text.innerText = `Your NPV is ${calcNPV()}`;
        description.style.top = `${form__1.getBoundingClientRect().height + form__2.getBoundingClientRect().height}px`;
        document.querySelector(".result").style.display = "block";
        document.querySelector(".npv").innerText = `The Net Present Value = ${calcNPV()}`;
        document.querySelector(".probability").innerText = `The probability of the NPV > 0 is ${probabilityFunc().toFixed(2)}%`;
        document.querySelector(".mean").innerText = `The mean NPV = ${meanFunc().toFixed(2)}`;

    } else if (revenues.length !== 0 && expenditures.length !== 0 && !investment && k && tax){
        description.style.top = `${300+table.getBoundingClientRect().height}px`;
        text.innerText = "Please insert the initial investment! Try again!";
        document.querySelector(".result").style.display = "none";

    } else if (revenues.length === 0 || expenditures.length === 0){
        description.style.top = "250px";
        text.innerText = "Revenues and expenditures are required. Try again!";
        document.querySelector(".result").style.display = "none";
    }
    else if (revenues.length !== 0 && expenditures.length !== 0 && investment && !k && tax) {
        description.style.top = `${410+table.getBoundingClientRect().height}px`;
        text.innerText = "Please insert the cost of capital! Try again!";
        document.querySelector(".result").style.display = "none";
    } else if (revenues.length !== 0 && expenditures.length !== 0 && investment && k && !tax) {
        description.style.top = `${540+table.getBoundingClientRect().height}px`;
        text.innerText = "Dont't forget the tax rate :-) Try again!";
        document.querySelector(".result").style.display = "none";
    } else {
        description.style.top = `${300+table.getBoundingClientRect().height}px`;
        text.innerText = "Please complete all fields. Try again!";
        document.querySelector(".result").style.display = "none";
    }
    
    document.querySelector(".btn__2").disabled = true;
})


