const Location = require("../models/location.js");
const Cycle = require("../models/cycle.js");
const Ride = require("../models/ride.js");
const { v4: uuidv4 } = require("uuid");

const load = async (req, res) => {
    res.json({
        status: true,
        message: "Welcome to Ecolyf",
        errors: [],
        data: {},
      });
}

const getAvailabilities = async (req, res) => {
  let standName = req.params.name;
  // let details = await Location.findOne({uuid:standId});
  // let available = await Location.aggregate([{$match: {id:standId}},{$project: {count: { $size:"$cycleUuid" }}}]).exec();
  let details = await Location.findOne({standName:standName});
  let cycles = {'Geared': 0, 'Regular': 0, 'Diva': 0};
  details.cycleUuid.forEach(async (element) => {
    // let c = await Cycle.findOne({uuid:element.uuid});
    if(element.cycleType in cycles) {
      cycles[element.cycleType] = cycles[element.cycleType] + 1;
    } else {
      cycles[element.cycleType] = 1;
    }
  });

  let available = details.cycleUuid.length;
  // console.log(available);
  for (let key of Object.keys(details.prebooked)) {
    // console.log(key);
    available = available - details.prebooked[key];
    cycles[key] = cycles[key] - details.prebooked[key];
  }
  res.json({
    status: true,
    message: "data",
    errors: [],
    data: {available:available, cycles:cycles, stand: standName},   
  });
}

const prebook = async (req, res) => {
  let standName = req.body.stand;
  let cycleType = req.body.cycleType;
  // console.log(req.body);
  let date = new Date();
  let data = await Location.findOne({standName:standName});
  data.prebooked[cycleType] = data.prebooked[cycleType] + 1;
  

  let ride = new Ride({
    uuid: uuidv4() + '_ride_' + req.user.name.replace(/\s+|\s+$/gm,''),
    userUuid: req.user.uuid,
    from: standName,
    to: '',
    cycleUuid:{
        uuid:'',
        cycleType:cycleType
    },
    distance: 0,
    isBooked: false,
    time: date.toLocaleString()
});
await data.save();
await ride.save();
  res.json({
    status: true,
    message: "save successfully",
    errors: [],
    data: {},
  });

}

const getUser = async (req,res) => {
  res.json({
    status: true,
    message: "data",
    errors: [],
    data: {
      user: req.user
    },
  });
}

const addCycle = async (req, res) => {
  try {
  // console.log('1');
  const quantity = req.body.quantity;
  const cycleType = req.body.cycleType;
  const stand = req.body.input;
  const price = req.body.price;
  const company = req.body.company
  // console.log('2');
  // console.log(req.body);
  for (let index = 0; index < quantity; index++) {
    // console.log('3');
    const date = new Date();
    const newcycle = new Cycle({
      uuid: uuidv4() + '_' + Date.now().toString(),
      companyName: company.toLowerCase(),
      cycleType: cycleType,
      currentlyUsedBy: '',
      currentLocation: '',
      currentStandName: stand,
      addedOn: date.toLocaleString(),
      price: price,
      isOccupied: false,
    });
    
    let location = await Location.findOne({standName: stand});
    location.cycleUuid.push({
      uuid: newcycle.uuid,
      cycleType: cycleType
    });
    await newcycle.save();
    await location.save();
    if(index == quantity-1){
      res.json({
        status: true,
        message: "data",
        errors: [],
        data: {},
      });
    }  
  
}
} catch (error) {
  res.json({
    status: false,
    message: "error while adding",
    errors: [],
    data: {},
  });
}

}

const addStand = async (req, res) => {
  try {
  // console.log('1');
  const stand = req.body.stand;
  const area = req.body.area;
  // console.log('2');
  // console.log(req.body);
    // console.log('3');
    const date = new Date();
    const newstand = new Location({
      uuid: uuidv4() + '_' + stand.toLowerCase(),
      standName:stand,
      cycleUuid:[],
      area:area,
      isEmpty:false,
      prebooked:{
          Geared:0,
          Regular: 0,
          Diva: 0,
      },
  
  });
    await newstand.save();

      res.json({
        status: true,
        message: "data",
        errors: [],
        data: {},
      });
  
} catch (error) {
  res.json({
    status: false,
    message: "error while adding",
    errors: [],
    data: {},
  });
}

}

const getRides = async (req,res) =>{
  let uuid = req.user.uuid;
  let rides = await Ride.find({userUuid:uuid});

  // const result = words.filter(word => word.length > 6);
 
  if(rides.length > 0) {
    let upcoming = rides.filter(ride => !ride.isBooked);
    let current = rides.filter(ride => (ride.isBooked && ride.to == ''));
    let finished = rides.filter(ride => (ride.isBooked && ride.to != ''));
    res.json({
      status: true,
      message: "data",
      errors: [],
      data: {
        upcoming: upcoming,
        current: current,
        finished: finished
      },
    });
  } else {
    res.json({
      status: true,
      message: "data",
      errors: [],
      data: {
        upcoming: [],
        current: [],
        finished: []
      },
    });
  }
}

module.exports = {
    load,
    getAvailabilities,
    getUser,
    addCycle,
    addStand,
    prebook,
    getRides
  };