
const chai = require('chai');
chai.use(require('chai-http'));
const { expect } = require('chai');

const app = require('../bin/server');

const agent = chai.request.agent(app);

const context = {};

describe('Twitter App', () => {
  it('should login', (done) => {
    agent.post('/users/login')
      .set('Accept', 'application/json')
      .send({
        loginId: 'jayasurya1@gmail.com',
        password: 'Test@1234',
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        context.token = res.body.token;
        context.userId = res.body._id;
        done();
      });
  });
  it('should get profile', (done) => {
    const { token, userId } = context;
    agent.get(`/users/profile/${userId}`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should get tweet', (done) => {
    const { token } = context;
    agent.get('/tweets/fetchTweetByID/5ddddfd5d93f5437285eb551')
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should get followers of user', (done) => {
    const { token, userId } = context;
    agent.get(`/users/followersOfUserId/${userId}`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should get users followed by user', (done) => {
    const { token, userId } = context;
    agent.get(`/users/followedByUserId/${userId}`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should get all lists not created by requesting user', (done) => {
    const { token, userId } = context;
    agent.get(`/lists/all/${userId}`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should get all lists owned by requesting user', (done) => {
    const { token, userId } = context;
    agent.get(`/lists/owned/${userId}`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should get all lists subscribed by requesting user', (done) => {
    const { token, userId } = context;
    agent.get(`/lists/subscribed/${userId}`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should get all tweets and retweets posted by users followed by requesting user', (done) => {
    const { token, userId } = context;
    agent.get(`/tweets/fetchTweetByUserID/${userId}/USERFEED?start=0&count=2`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should get all tweets and retweets posted by the user', (done) => {
    const { token, userId } = context;
    agent.get(`/tweets/fetchTweetByUserID/${userId}/MYTWEETS?start=0&count=2`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('should get all tweets and retweets bookmarked by user', (done) => {
    const { token, userId } = context;
    agent.get(`/tweets/fetchTweetByUserID/${userId}/BOOKMARKEDTWEETS?start=0&count=2`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      })
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
