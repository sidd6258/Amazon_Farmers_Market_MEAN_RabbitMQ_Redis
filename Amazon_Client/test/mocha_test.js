/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){
	
	it('Farmer should be able to login and see his/her profile page', function(done){
		request.post('http://localhost:9200/farmerLogin',
				{ form: { farmerId: '134-23-9876',password:'1234' } },
				function(error,response,body) {
					assert.equal(200, response.statusCode);
					done();
				})
			});
	
	it('Farmer should be able to see his/her profile page', function(done) {
		request.get('http://localhost:9200/farmerProfile',
				function (error, response, body) {
			//	console.log(JSON.stringify(response));
				assert.equal(200, response.statusCode);
				done();
			})
		});

	it('Customer should be able to login if the url is correct', function(done){
		request.post('http://localhost:9200/customerLogin',
				{ form: { customerId: 'siddharth6258@gmail.com',password:'1234' } },
				function(error,response,body) {
				//	console.log(JSON.stringify(response));
			assert.equal(200, response.statusCode);
			done();
		})
	});
	it('Customer should be able to see his/her profile page', function(done) {
		request.get('http://localhost:9200/customerProfile',
				function (error, response, body) {
				//console.log(JSON.stringify(response));
				assert.equal(200, response.statusCode);
				done();
			})
		});
	it('Admin should be able to login if the url is correct', function(done){
		request.post('http://localhost:9200/adminLogin',
				{ form: { adminId: 'admin@sjsu.com',password:'admin' } },
				function(error,response,body) {
				//	console.log(JSON.stringify(response));
			assert.equal(200, response.statusCode);
			done();
		})
	});
	it('Admin should be able to see pending Farmer requests for approval', function(done) {
		request.get('http://localhost:9200/farmerRequestList',
				function (error, response, body) {
				//console.log(JSON.stringify(response));
				assert.equal(200, response.statusCode);
				done();
			})
		});
	it('Admin should be able to see pending Customer requests for approval', function(done) {
		request.get('http://localhost:9200/customerRequestList',
				function (error, response, body) {
				//console.log(JSON.stringify(response));
				assert.equal(200, response.statusCode);
				done();
			})
		});
});