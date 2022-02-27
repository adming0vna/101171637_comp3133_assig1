const { ApolloError } = require('apollo-server-errors');
const User = require('./models/user.js');
const Listing = require('./models/listing.js');
const Booking = require('./models/booking.js');


exports.resolver = {
    Query: {
        getAllBookings: async (parent, args) => {
            return await Booking.find({})
        },
        getAllListings: async (parent, args) => {
            return await Listing.find({})
        },
        getAllListingsAdmin: async (parent, args) => {
            if (!args.userId) {
                return
            }
            const find = await User.findById(args.userId)
            if (!find) {
                return
            }
            if (find.type != 'admin') {
                return
            }
            return await Listing.find({ username: search.username})
        },
        getListingByCity: async (parent, args, context) => {
            return await Listing.find({ city: args.city})
        },
        getListingByName: async (parent, args, context) => {
            return await Listing.find({ listing_title: args.listing_title})
            
        },
        getListingByPostalCode: async (parent, args, context) => {
            return await Listing.find({ postal_code:  args.postal_code})            
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const userExist = await User.findOne({ username: args.username });
            
            if (userExist) {
                throw new ApolloError('The username is aleready taken');
            }
            const newUser = new User(args);
            newUser.save((err, success) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("User created");
                }
            })
            return newUser;
        },
        addListing: async (parent, args) => {
            if (!args.userId) {
                return
            }
            const search = await User.findById(args.userId)
            if (!search) {
                return
            }
            if (search.type != 'admin') {
                return
            }
            let list = new Listing({
                listing_id: args.listing_id,
                listing_title: args.listing_title,
                description: args.description,
                street: args.street,
                city: args.city,
                postal_code: args.postal_code,
                price: args.price,
                email: search.email,
                username: search.username
            })
            return await list.save();
            
          
        },
        addBooking: async (parent, args) => {
            if (!args.userId) {
                return
            }
            if (!args.listing_id) {
                return
            }
            const search = await User.findById(args.userId)
            if (!search) {
                return
            }
            let newBooking = new Booking({

                listing_id: args.listing_id,
                booking_id: args.booking_id,
                booking_date: new Date().toString(),
                booking_start: new Date(args.booking_start.toString()),
                booking_end: new Date(args.booking_end.toString()),
                username: search.username                
            })
                
            return newBooking.save()
        },
        login: async (parent, text ) => {
            const search = await User.findOne({ username: text.username })
            if (!search) {
                return
            }
            if (search.password != text.password) {
                return
            }
            return search._id
        }
    }
}