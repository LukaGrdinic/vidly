const request = require('supertest');
const { Genre } = require('../../models/genre');

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
        await Genre.collection.insertMany([
            {genreName: 'genre1'},
            {genreName: 'genre2'},   
        ]);
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((genre) => genre.genreName === 'genre1')).toBeTruthy();
      expect(res.body.some((genre) => genre.genreName === 'genre2')).toBeTruthy();
    });
  });

  describe('GET/:id', () => {
      it('should return a genre if valid id is passed', async () => {
          const genre = new Genre({genreName: 'genre1'});
          await genre.save();

          const res = await request(server).get('/api/genres/' + genre._id);

          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('genreName', genre.genreName);
      });
      it('should return 404 if invalid id is passed', async () => {

          const res = await request(server).get('/api/genres/1');

          expect(res.status).toBe(404);
      })
  })
});
