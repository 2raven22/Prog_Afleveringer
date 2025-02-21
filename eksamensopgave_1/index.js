let currentJoke = null
let currentPage = 1
let jokeData

function setup(){
    noCanvas()
    FetchJokes()
}

function FetchJokes(){
    //fetch vores API
    fetch('https://official-joke-api.appspot.com/random_joke')
    .then(response => response.json(    ))
    .then(data => {
        jokeData = [data];
        console.log(jokeData)
        displayJoke()
    })
    .catch(error => console.error('Error fetching joke', error))
}

function displayJoke(){
    for(let j = 0; j<jokeData.length; j++){
    const jokeElement = select(`#jokes${j+1}`)
    const optionscontainer = select(`#options${j+1}`)
    currentJoke = jokeData[j]
    jokeElement.html(currentJoke.joke)
    console.log(j)
    //clear forrige options
    optionscontainer.html('')
    }
}