var app = require('../bin/server');

var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;

var agent = require('chai').request.agent(app);
var context = {}

describe('Twitter App', function () {
	it('should login', function (done) {
		agent.post('/users/login')
			.set('Accept', 'application/json')
			.send({
				'loginId': 'jayasurya1@gmail.com',
				'password': 'Test@1234',
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				context.token = res.body.token
				context.userId = res.body._id 
				done();
			});
	});
	it('should get profile', function (done) {
		const { token, userId } = context
		agent.get(`/users/profile/${userId}`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should get tweet', function (done) {
		const { token } = context
		agent.get(`/tweets/fetchTweetByID/5ddddfd5d93f5437285eb551`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should get followers of user', function (done) {
		const { token, userId } = context
		agent.get(`/users/followersOfUserId/${userId}`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should get users followed by user', function (done) {
		const { token, userId } = context
		agent.get(`/users/followedByUserId/${userId}`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should get all lists not created by requesting user', function (done) {
		const { token, userId } = context
		agent.get(`/lists/all/${userId}`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should get all lists owned by requesting user', function (done) {
		const { token, userId } = context
		agent.get(`/lists/owned/${userId}`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should get all lists subscribed by requesting user', function (done) {
		const { token, userId } = context
		agent.get(`/lists/subscribed/${userId}`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should get all tweets and retweets posted by users followed by requesting user', function (done) {
		const { token, userId } = context
		agent.get(`/tweets/fetchTweetByUserID/${userId}/USERFEED?start=0&count=2`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should get all tweets and retweets posted by the user', function (done) {
		const { token, userId } = context
		agent.get(`/tweets/fetchTweetByUserID/${userId}/MYTWEETS?start=0&count=2`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should get all tweets and retweets bookmarked by user', function (done) {
		const { token, userId } = context
		agent.get(`/tweets/fetchTweetByUserID/${userId}/BOOKMARKEDTWEETS?start=0&count=2`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
})