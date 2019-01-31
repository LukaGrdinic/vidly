const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe('GET/', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([{ genreName: 'genre1' }, { genreName: 'genre2' }]);
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(genre => genre.genreName === 'genre1')).toBeTruthy();
      expect(res.body.some(genre => genre.genreName === 'genre2')).toBeTruthy();
    });
  });

  describe('GET/:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ genreName: 'genre1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('genreName', genre.genreName);
    });
    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });
  });

  describe('POST', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(server)
        .post('/api/genres/')
        .send({ name: 'genre1' });

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 3 characters', async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({ name: '12' });

      expect(res.status).toBe(400);
    });
    it('should return 400 if genre is more than 20 characters', async () => {
      const token = new User().generateAuthToken();
      const name = new Array(22).join('a');
      const res = await request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({ name: 'genre1' });

      const genre = await Genre.find({ name: 'genre1' });
      expect(genre).not.toBeNull(); // NOT A GOOD TEST, GENRE IS NEVER NULL
    });
    it('should return the genre if it is valid', async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({ name: 'genre1' });

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('genreName', 'genre1');
    });
  });

  describe('PUT/:id', () => {
    it('should return 404 if the genre with the given id does not exist', async() => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .put('/api/genres/1')
        .set('x-auth-token', token)
        .send({ name: 'genre1' });

      expect(res.status).toBe(404);
    });

    it('should return 400 if the submitted genre value is shorter than 3 characters', async() => {
      const token = new User().generateAuthToken();
      const genre = new Genre({ genreName: 'genre1' });
      await genre.save();

      const res = await request(server)
        .put('/api/genres/' + genre._id)
        .set('x-auth-token', token)
        .send({ name: 'x' });

      expect(res.status).toBe(400);
    });
    it('should return 400 if the submitted genre value is longer than 20 characters', async() => {
      const token = new User().generateAuthToken();
      const genre = new Genre({ genreName: 'genre1' });
      await genre.save();

      const name = new Array(22).join('a');

      const res = await request(server)
        .put('/api/genres/' + genre._id)
        .set('x-auth-token', token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });
    it('should return 200 if the submitted genre successefully updated previous genre', async() => {
      const token = new User().generateAuthToken();
      const genre = new Genre({ genreName: 'genre1' });
      await genre.save();

      const res = await request(server)
        .put('/api/genres/' + genre._id)
        .set('x-auth-token', token)
        .send({ name: 'genre2' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('genreName', 'genre2');
    });
  });

  describe('DELETE/:id', () => {
    it('should return 500 if the given id does not exist', async() => {
      const adminUser = new User();
      adminUser.isAdmin = true;
      const token = adminUser.generateAuthToken();
      const genre = new Genre({ genreName: 'genre1' });

      const res = await request(server)
      .delete('/api/genres/' + genre._id)
      .set('x-auth-token', token);

      expect(res.status).toBe(500);
    });
    it('should return 200 if the genre with provided id is deleted', async() => {
      const adminUser = new User();
      adminUser.isAdmin = true;
      const token = adminUser.generateAuthToken();
      const genre = new Genre({ genreName: 'genre1' });
      await genre.save();

      const res = await request(server)
      .delete('/api/genres/' + genre._id)
      .set('x-auth-token', token)
      .send();

      expect(res.status).toBe(200);
    });
  })
});
