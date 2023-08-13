const router = require('express').Router()

const GetApp = async (req, res)=>{
    try {
        return res.status(200).json({message: 'Welcome to the Pepp Rider Service'})
    } catch (error) {
        res.status(500)
        return res.json({status: false, message: error})
    }
}

router.get('/', GetApp)

module.exports = router
