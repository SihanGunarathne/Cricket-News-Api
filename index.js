const PORT = process.env.PORT || 3000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const cricNewspapers = [
    {
        name: 'espn',
        address: 'https://www.espncricinfo.com/latest-cricket-news',
        base: 'https://www.espncricinfo.com'
    },
    {
        name: 'aljazeera',
        address: 'https://www.aljazeera.com/sports',
        base: ''
    },
    {
        name: 'BBC',
        address: 'https://www.bbc.com/sport',
        base: 'https://www.bbc.com'
    },
    {
        name: 'cricbuzz',
        address: 'https://www.cricbuzz.com',
        base: 'https://www.cricbuzz.com'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/sport/cricket',
        base: 'https://www.theguardian.com'
    },
    {
        name: 'rediff',
        address: 'https://www.rediff.com/cricket',
        base: ''
    },
    {
        name: 'ndtv',
        address: 'https://www.ndtv.com/#pfrom=sports-header-globalnav',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/cricket',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'skysports',
        address: 'https://www.skysports.com/cricket',
        base: 'https://www.skysports.com'
    },
    {
        name: 'cricket365',
        address: 'https://www.cricket365.com',
        base: ''
    },
    {
        name: 'CNN',
        address: 'https://edition.cnn.com/sport',
        base: ''
    },
    
    
]

const articles = []

cricNewspapers.forEach(cricNewspaper => {
    axios.get(cricNewspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("T20")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: cricNewspaper.base + url,
                    source: cricNewspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Latest Cricket News API')
})

app.get('/cricnews', (req, res) => {
    res.json(articles)
})

app.get('/cricnews/:cricNewspaperId', (req, res) => {
    const cricNewspaperId = req.params.cricNewspaperId

    const cricNewspaperAddress = cricNewspapers.filter(cricNewspaper => cricNewspaper.name == cricNewspaperId)[0].address
    const cricNewspaperBase = cricNewspapers.filter(cricNewspaper => cricNewspaper.name == cricNewspaperId)[0].base


    axios.get(cricNewspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("T20")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: cricNewspaperBase + url,
                    source: cricNewspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
