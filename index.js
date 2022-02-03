let headersList = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMwMzk1MywiZXhwIjoxOTU4ODc5OTUzfQ.AKEc3MvmPky-qVqrE8rp4Qg_EG6x414Ma51dN6vQypI"
}

// fetch("https://jyulqgzqmgxioggcdvil.supabase.co/rest/v1/tarifas?year=eq.2020&division=eq.Norte&tariff=eq.DIST&select=*", {
//     method: "GET",
//     headers: headersList
// }).then(function (response) {
//     return response.text();
// }).then(function (data) {
//     console.log(data);
// })


//Basic config
const today = new Date()

//SELECTED FOR QUERY
let selected = {
    year: today.getFullYear(),
    month: today.getMonth(),
    division: 'Golfo Norte'
}


//OPTIONS
const years = [2019, 2020, 2021, 2022]
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const divisions = [
    "Golfo Norte",
    "Bajio",
    "Norte",
    "Jalisco",
    "Golfo Centro",
    "Peninsular",
    "Sureste",
    "Oriente",
    "Baja California",
    "Baja California Sur",
    "Valle de Mexico Centro",
    "Valle de Mexico Norte",
    "Valle de Mexico Sur",
    "Centro Occidente",
    "Centro Oriente",
    "Centro Sur",
    "Noroeste",
]

//DOM ELEMENTS
const yearsDropdown = document.querySelector('#inputYear')
const monthsDropdown = document.querySelector('#inputMonth')
const divisionsDropdown = document.querySelector('#inputDivision')



//Populate Dropdowns with given array
const fillDropdowns = (dropdownName, arrayToFillWith) => {

    arrayToFillWith.forEach(elem => {
        dropdownName.innerHTML += `<option value="${elem}">${elem}</option>`
    })
}

fillDropdowns(yearsDropdown, years)
fillDropdowns(monthsDropdown, months)
fillDropdowns(divisionsDropdown, divisions)

yearsDropdown.addEventListener('change', function () {
    selected.year = this.value
    fetchData()
});

monthsDropdown.addEventListener('change', function () {
    selected.month = this.value
    fetchData()
});

divisionsDropdown.addEventListener('change', function () {
    selected.division = this.value
    fetchData()
});


window.addEventListener('change', function () {
    console.log(selected)
})


const fetchData = async () => {

    const { year, month, division } = selected

    const URL = `https://jyulqgzqmgxioggcdvil.supabase.co/rest/v1/tarifas?year=eq.${year}&division=eq.${division}&tariff=eq.GDMTH&month=eq.${month}&select=*`

    const res = await fetch(URL, {
        method: "GET",
        headers: headersList
    })

    const data = await res.json()
    const results = data[0]
    createTable(results)
}


const tableRow = (concept, units, value) => {
    return `
        <tr>
         
            <td>${concept}</td>
            <td>${units}</td>
            <td>${value}</td>
        </tr>
    `
}

const createTable = results => {

    try {
        document.querySelector('.output-title').innerHTML = `<h4>${selected.division} -${selected.month}/${selected.year}</h4>`
        document.querySelector('.results').innerHTML = `
    
        <table class="table">
      <thead>
        <tr>
            <th scope="col">Concepto</th>
            <th scope="col">Unidades</th>
            <th scope="col">Valor</th>
        </tr>
      </thead>
      <tbody>
            ${tableRow('Cargo fijo', 'MXN/mes', results.fijo)}
            ${tableRow('Energía base', 'MXN/kWh', results.base)}
            ${tableRow('Energía intermedia', 'MXN/kWh', results.intermedia)}
            ${tableRow('Energía punta', 'MXN/kWh', results.punta)}
            ${results.semipunta ? tableRow('Energía semipunta', 'MXN/kWh', results.semipunta) : ''}
            ${tableRow('Capacidad', 'MXN/kW', results.capacidad)}
            ${results.distribucion ? tableRow('Energía distribución', 'MXN/kW', results.distribucion) : ''}
    </tbody>
    </table>  `
    } catch (e) {


        document.querySelector('.output-title').innerHTML = `
        
        <div class="alert alert-danger" role="alert">
        ${selected.division} -${selected.month}/${selected.year} no disponible
        </div>`


        document.querySelector('.results').innerHTML = ''
    }


}














fetchData()