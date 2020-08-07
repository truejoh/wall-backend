const chai = require('chai');
const expect = chai.expect;
const url = 'http://192.168.1.112:5000/api/v1';
const request = require('supertest')(url);

describe('Article API', () => {
  let token = '';

  before(done => {
    request
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'test123',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        done();
      });
  });

  it('should get articles', function (done) {
    this.timeout(5000);
    request
      .get('/article')
      .send()
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('articles');
        expect(res.body).to.have.property('success');
        expect(res.body.success).to.be.an('boolean');
        expect(res.body.articles).to.be.an('array');
        done();
      });
  });

  it('should create article', done => {
    request
      .post('/article')
      .set('Authorization', token)
      .send({
        content: 'test article',
        tag: 'SPORT',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('success');
        expect(res.body).to.have.property('article');
        expect(res.body.message).to.be.an('string');
        expect(res.body.success).to.be.true;
        expect(res.body.article).to.have.property('_id');
        expect(res.body.article).to.have.property('content');
        expect(res.body.article).to.have.property('tag');
        done();
      });
  });

  describe('article action', () => {
    let articleId = '';
    before(done => {
      request
        .post('/article')
        .set('Authorization', token)
        .send({
          content: 'test article',
          tag: 'SPORT',
        })
        .expect(200)
        .end((err, res) => {
          articleId = res.body.article._id;
          done();
        });
    });

    it('update article', done => {
      request
        .put(`/article/${articleId}`)
        .set('Authorization', token)
        .send({
          content: 'updated article',
          tag: 'SPORT',
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('success');
          expect(res.body.message).to.be.an('string');
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('favorite article', done => {
      request
        .post(`/article/${articleId}/favorite`)
        .set('Authorization', token)
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('success');
          expect(res.body.message).to.be.an('string');
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('delete article', done => {
      request
        .delete(`/article/${articleId}`)
        .set('Authorization', token)
        .send()
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('success');
          expect(res.body.message).to.be.an('string');
          expect(res.body.success).to.be.true;
          done();
        });
    });

    it('create article comment', done => {
      request
        .post(`/article/${articleId}/comment`)
        .set('Authorization', token)
        .send({
          content: 'test article comment',
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('success');
          expect(res.body.message).to.be.an('string');
          expect(res.body.success).to.be.true;
          done();
        });
    });
  });
});
