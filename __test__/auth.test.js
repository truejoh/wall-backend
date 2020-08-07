const chai = require('chai');
const expect = chai.expect;
const url = 'http://192.168.1.112:5000/api/v1';
const request = require('supertest')(url);

describe('Auth API', () => {
  let token = '';

  it('should signup', function (done) {
    this.timeout(5000);
    request
      .post('/auth/register')
      .send({
        email: 'admin@test.com',
        password: '12345678abc',
        firstname: 'test',
        lastname: 'test',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user');
        expect(res.body.token).to.be.an('string');
        token = res.body.token;
        done();
      });
  });

  it('should login', done => {
    request
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'test123',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('user');
        expect(res.body.token).to.be.an('string');
        token = res.body.token;
        done();
      });
  });

  it('should view profile', done => {
    request
      .get('/auth/user')
      .set('Authorization', token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('user');
        done();
      });
  });

  it('should logout', done => {
    request
      .get('/auth/logout')
      .set('Authorization', token)
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
