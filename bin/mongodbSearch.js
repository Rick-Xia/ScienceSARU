const mongoose = require('mongoose');
const R6ids = require('../models/r6ids');


module.exports.get = ( id ) => {
    console.log(`trying to search db using ${id}, the type of it is ${typeof id}`);

    // var temp = new R6ids({ discordID: '2', rssID: 'snickers' });
    // temp.save(function (err) {
    //     if (err) console.log(err);
    // });

    // R6ids.find({}, function (err, list) {
    //     console.log(`the whole list is: ${list}`);
    // });

    // R6ids.find({})
    // .then(list => {
    //     console.log(JSON.stringify(list));
    //     console.log(`the whole list is: ${list}`);

    // }, (err) => console.log(`query db failed`))
    // .catch((err) => next(err));


    R6ids.findOne({ discordID: id })
    .then(user => {
        console.log( `${user.discordID} : ${user.rssID}` );
        return true;
    })
    .catch(err => console.log(`a`));
}

// /*
//     to create a new discordID-uplayID pair in database
//  */
// module.exports.post = async ( id, val ) => {
//     USERS[id] = val;
//     fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
//     return;
// }

// /*
//     to modify an existing pair
//  */
// module.exports.put = async ( id, val ) => {
//     USERS[id] = val;
//     fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
//     return;
// }

// module.exports.delete = async ( id ) => {
//     R6id.findByIdAndRemove(id)
//     delete USERS[id];
//     fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
//     return;
// }




// const promoRouter = express.Router();

// promoRouter.use( bodyParser.json() );

// promoRouter.route('/')
// .get( (req,res,next) => {
//     Promo.find({})
//     .then((promo) => {
//         res.statusCode = 200;
//         res.setHeader('Content-type', 'application/json');
//         res.json(promo);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post( (req,res,next) => {
//     Promo.create(req.body)
//     .then((promo) => {
//         console.log('Promotion created: ', promo);
//         res.statusCode = 200;
//         res.setHeader('Content-type', 'application/json');
//         res.json(promo);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .put( (req,res,next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /promotions');
// })
// .delete( (req,res,next) => {
//     Promo.remove({})
//     .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-type', 'application/json');
//         res.json(resp);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

// promoRouter.route('/:id')
// .get( (req,res,next) => {
//     Promo.findById(req.params.id)
//     .then((promo) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(promo);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post( (req,res,next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /promotions/' + req.params.id);
// })
// .put( (req,res,next) => {
//     Promo.findByIdAndUpdate(req.params.id, {
//         $set: req.body
//     }, { new: true })
//     .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .delete( (req,res,next) => {
//     Promo.findByIdAndRemove(req.params.id)
//     .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });

// module.exports = promoRouter;
