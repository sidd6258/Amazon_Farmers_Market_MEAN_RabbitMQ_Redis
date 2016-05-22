var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/amazon";
var mysql = require("./mysql");
var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');
client.on('connect', function() {
    console.log('Connected to Redis server');
});
exports.viewCustomerProfile = function(msg, callback){	
	var res = {};
	var customerId = "123-12-1234";
	var emailId = "siddharth6258@gmail.com";
	var getCustomerInfo="select * from CUSTOMER where CUST_ID='"+customerId+"'OR EMAIL_ID='"+emailId+"';";
	mysql.fetchData(function(err, getCustomerInfoResult){
		if (err) {
			throw err;
		} else{
			if (getCustomerInfoResult.length > 0) {
				res.customerId=getCustomerInfoResult[0].CUST_ID;
				res.firstName=getCustomerInfoResult[0].FIRST_NAME;
				res.lastName=getCustomerInfoResult[0].LAST_NAME;
				res.address=getCustomerInfoResult[0].ADDRESS;
				res.city=getCustomerInfoResult[0].CITY;
				res.state=getCustomerInfoResult[0].STATE;
				res.zipCode=getCustomerInfoResult[0].ZIP_CODE;
				res.phoneNumber=getCustomerInfoResult[0].PHONE;

				getProductListCustomer(res,callback,customerId);
			} else {
				res.value = "404";
				callback(null, res);
			}
		}
	}, getCustomerInfo);
};



function getProductListCustomer(res,callback,customerId) {

	var productList = '';
	var cust_Id = customerId;
	var getProductList = "SELECT P.PRODUCT_ID,P.FARMER_ID,F.FIRST_NAME,F.LAST_NAME,P.PRODUCT_NAME,P.PRODUCT_PRICE,P.PRODUCT_QTY,P.PRODUCT_DESCRIPTION,P.PRODUCT_AVG_RATINGS,P.PROD_CAT FROM PRODUCT P,FARMER F WHERE P.STATUS='1' AND P.APPROVED_PRODUCT='1' AND F.FARMER_ID = P.FARMER_ID ORDER BY P.PRODUCT_ID;";
	client.get(customerId, function (err, result) {
		 if (err) throw err;
	        else if (result){ //Id exists in cache
	        	console.log("Data cached in Redis "+JSON.stringify(result));
	        	getProductList=JSON.parse(result);	 
				res.productList=getProductList;
				var productIdList =[];
				for(var i=0;i<getProductList.length;i++) {
					productIdList[i] = getProductList[i].PRODUCT_ID;
				}
				mongo.connect(mongoURL, function(){
					var coll = mongo.collection('ProductReview');
					coll.find({"productId" : { $in: productIdList}},{"productId":1,"imgpath":1,"_id":0}).sort({"productId":1}).toArray(function(err, productImageResult){
						if (err) {
							throw err;
						} else{
							if (productImageResult){
								res.productImageResult = productImageResult;
							}
							res.value="200";
							callback(null, res);
						}
					});
				});

	        }
	        else{
	        	console.log("Inside redis client to store New Data");
	mysql.fetchData(function(err, getProductList){
		if (err) {
			throw err;
		} else{
			if (getProductList.length > 0) {
				res.productList=getProductList;
				var productIdList =[];
				client.set(customerId, JSON.stringify(getProductList));
				for(var i=0;i<getProductList.length;i++) {
					productIdList[i] = getProductList[i].PRODUCT_ID;
				}
				mongo.connect(mongoURL, function(){
					var coll = mongo.collection('ProductReview');
					coll.find({"productId" : { $in: productIdList}},{"productId":1,"imgpath":1,"_id":0}).sort({"productId":1}).toArray(function(err, productImageResult){
						if (err) {
							throw err;
						} else{
							if (productImageResult){
								res.productImageResult = productImageResult;
							}
							res.value="200";
							callback(null, res);
						}
					});
				});
			} else {
			res.value="200";
			callback(null, res);
			}
		}
	}, getProductList);
}});
};