const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let likesAtStart = 0;
let rel_likesAtStart1 = 0;
let rel_likesAtStart2 = 0;

// Make sure you never liked stock named "GOOG" and "MSFT" before (which mean your ip not in database).
// To pass this test again you need to change ip address or delete records created after running this test.
suite("Functional Tests", function () {
  test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices")
      .query({ stock: "goog" })
      .end((err, res) => {
        if (err) assert.fail();
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.containsAllKeys(res.body.stockData, ["stock", "price", "likes"]);
        assert.isString(res.body.stockData.stock);
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        likesAtStart = res.body.stockData.likes;
        done();
      });
  });

  test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices")
      .query({ stock: "goog", like: "true" })
      .end((err, res) => {
        if (err) assert.fail();
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.containsAllKeys(res.body.stockData, ["stock", "price", "likes"]);
        assert.isString(res.body.stockData.stock);
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.equal(res.body.stockData.likes, likesAtStart + 1);
        done();
      });
  });

  test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices")
      .query({ stock: "goog", like: "true" })
      .end((err, res) => {
        if (err) assert.fail();
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.containsAllKeys(res.body.stockData, ["stock", "price", "likes"]);
        assert.isString(res.body.stockData.stock);
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.equal(res.body.stockData.likes, likesAtStart + 1);
        done();
      });
  });

  test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices?stock=GOOG&stock=MSFT")
      .end((err, res) => {
        if (err) assert.fail();
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.containsAllKeys(res.body.stockData[0], [
          "stock",
          "price",
          "rel_likes",
        ]);
        assert.isString(res.body.stockData[0].stock);
        assert.isNumber(res.body.stockData[0].price);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.containsAllKeys(res.body.stockData[1], [
          "stock",
          "price",
          "rel_likes",
        ]);
        assert.isString(res.body.stockData[1].stock);
        assert.isNumber(res.body.stockData[1].price);
        assert.isNumber(res.body.stockData[1].rel_likes);
        if (res.body.stockData[0].rel_likes > res.body.stockData[1].rel_likes) {
          assert.equal(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
        } else if (
          res.body.stockData[1].rel_likes > res.body.stockData[0].rel_likes
        ) {
          assert.equal(
            res.body.stockData[1].rel_likes + res.body.stockData[0].rel_likes,
            0
          );
        } else {
          assert.equal(res.body.stockData[0].rel_likes, 0);
          assert.equal(res.body.stockData[1].rel_likes, 0);
        }
        rel_likesAtStart1 = res.body.stockData[0].rel_likes;
        rel_likesAtStart2 = res.body.stockData[1].rel_likes;
        done();
      });
  });

  test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/stock-prices?stock=GOOG&stock=MSFT&like=true")
      .end((err, res) => {
        if (err) assert.fail();
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.containsAllKeys(res.body.stockData[0], [
          "stock",
          "price",
          "rel_likes",
        ]);
        assert.isString(res.body.stockData[0].stock);
        assert.isNumber(res.body.stockData[0].price);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.containsAllKeys(res.body.stockData[1], [
          "stock",
          "price",
          "rel_likes",
        ]);
        assert.isString(res.body.stockData[1].stock);
        assert.isNumber(res.body.stockData[1].price);
        assert.isNumber(res.body.stockData[1].rel_likes);
        if (res.body.stockData[0].rel_likes > res.body.stockData[1].rel_likes) {
          assert.equal(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
        } else if (
          res.body.stockData[1].rel_likes > res.body.stockData[0].rel_likes
        ) {
          assert.equal(
            res.body.stockData[1].rel_likes + res.body.stockData[0].rel_likes,
            0
          );
        } else {
          assert.equal(res.body.stockData[0].rel_likes, 0);
          assert.equal(res.body.stockData[1].rel_likes, 0);
        }
        assert.equal(res.body.stockData[0].rel_likes, rel_likesAtStart1 - 1);
        assert.equal(res.body.stockData[1].rel_likes, rel_likesAtStart2 + 1);
        done();
      });
  });
});
