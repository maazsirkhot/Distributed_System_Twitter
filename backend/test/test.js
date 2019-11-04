var assert = require('chai').assert;
var app = require('../bin/server');

var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;

var agent = require('chai').request.agent(app);
var context = {}

describe('Grubhub App', function () {

	it('should signup', function (done) {
		agent.post('/users/signup')
			.set('Accept', 'application/json')
			.send({
				'name': 'John Mayer',
				'email': 'johnmayer99@gmail.com',
				'password': 'Test@12345',
				'type': 'buyer'
			})
			.then(function (res) {
				expect(res.status).to.equal(201);
				done();
			});
	});
	it('should login', function (done) {
		agent.post('/users/login')
			.set('Accept', 'application/json')
			.send({
				'email': 'johnmayer99@gmail.com',
				'password': 'Test@12345',
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				context.token = res.body.token
				context.userId = res.body.id 
				// console.log('context------------------------', context)
				done();
			});
	});
	it('should get profile', function (done) {
		const { token, userId } = context
		// console.log('token=====================================', token)
		agent.get(`/users/profile/${userId}`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				// console.log('user>>', res.body)
				done();
			});
	});
	it('should update profile', function (done) {
		const { token, userId } = context
		agent.put(`/users/profile/${userId}`)
			.set({
				'Accept': 'application/json',
				'Authorization': `Bearer ${token}`
			})
			.send({
				'name': 'John Snow',
				'contactNumber': '1234567890'
			})
			.then(function (res) {
				expect(res.status).to.equal(200);
				done();
			});
	});
	it('should search food items', function (done) {
		const { token, userId } = context
		agent.get(`/users/profile/${userId}`)
			.query({search: 'pizza'}) 
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