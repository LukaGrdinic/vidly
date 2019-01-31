const request = require("supertest");
const Rental = require("../../models/rental");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        customerName: "12345",
        phone: "12345"
      },
      movie: {
        _id: movieId,
        title: "movie1",
        dailyRentalRate: 2
      }
    });

    await rental.save();
  });
  afterEach(async () => {
    server.close();
    await Rental.remove({});
  });

  it("should work", async () => {
    const res = await Rental.findById(rental._id);
    expect(res).not.toBeNull();
  });
  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 404 if no rental found for customer/movie combination", async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });
  it("should return 400 if return is already processed", async () => {

    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 200 if we have a valid request", async () => {

    const res = await exec();

    expect(res.status).toBe(200);
  });
});
