import express, { response } from 'express';
import { getDb, connectToDb } from './db.js';
import { ObjectId } from 'mongodb';

const app = express();
let db;

app.use(express.json());

connectToDb((err) => {
  if (!err) {
    
    app.listen(3000, () => {
      console.log('Server started');
    });

    
    db = getDb();
  } else {
    console.log('Failed to connect to database', err);
  }
});

app.get('/api/v3/app/events/:event_id', (req, res) => {
  const  event_id  = req.params.event_id;

  
  if (!ObjectId.isValid(event_id)) {
    return res.status(400).json({ error: 'Invalid event ID format.' });
  }

  
  db.collection('events')
    .findOne({ _id: new ObjectId(event_id) })
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    })
    .catch(err => {
      console.log('Error fetching event:', err);
      res.status(500).json({ error: 'Failed to fetch event' });
    });
})


app.post('/api/v3/app/events' ,(req,res)=>{

    const ele  = req.body;


    db.collection('events').insertOne(ele) .then(result => {
        res.status(201).json(result.insertedId)
      }) .catch(err => {
        res.status(500).json({err: 'Could not add the event'})
      })



})


app.delete('/api/v3/app/events/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {

        return res.status(500).json({error: 'Could not delete document'})
      }
  
    db.collection('events')
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not delete document'})
      })
  
    } 
      
    
  )


  app.get('/api/v3/app/events?type=latest&limit=5&page=1', (req, res) => {

  
  
    
    db.collection('events')
      .find().sort({ date: -1 }).limit(5)
      .then(doc => {
        if (doc) {
          res.status(200).json({page:1 ,
            limit: 5,
            events: doc});
        } else {
          res.status(404).json({ error: 'Event not found' });
        }
      })
      .catch(err => {
        console.log('Error fetching event:', err);
        res.status(500).json({ error: 'Failed to fetch event' });
      });
  })







   app.put('/api/v3/app/events/:id',(req,res)=>{


    const data = req.body

    const id = new ObjectId(req.params.id)

    db.collection('events').updateOne({_id: id} , {$set:data}).then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not update document'})
      })
    
    })








