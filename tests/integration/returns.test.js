const request = require('supertest');
const Rental = require('../../models/rental');
const { Movie } = require('../../models/movie');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../index');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      genre: { genreName: '12345' },
      numberInStock: 10
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        customerName: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: 'movie1',
        dailyRentalRate: 2
      }
    });

    await rental.save();
  });
  afterEach(async () => {
    server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it('should work', async () => {
    const res = await Rental.findById(rental._id);
    expect(res).not.toBeNull();
  });
  it('should return 401 if client is not logged in', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it('should return 400 if customerId is not provided', async () => {
    customerId = '';

    const res = await exec();
    expect(res.status).toBe(400);
  });
  it('should return 400 if movieId is not provided', async () => {
    movieId = '';

    const res = await exec();
    expect(res.status).toBe(400);
  });
  it('should return 404 if no rental found for customer/movie combination', async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });
  it('should return 400 if return is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it('should return 200 if we have a valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
  it('should set the return date if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000); // 10 seconds
  });
  it('should set the rentalFee if input is valid', async () => {
    rental.dateOut = moment()
      .add(-7, 'days')
      .toDate();
    await rental.save();
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });
  it('should set increase the movie stock', async () => {

    const res = await exec();

    const movieInDb = await Movie.findById(movieId);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
});
