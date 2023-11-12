"use strict";
const getStock = require("../tool/getStock");
const IpLike = require("../model/ipLike");

module.exports = function (app) {
  app.route("/api/stock-prices").get(async function (req, res) {
    const stock = req.query.stock || req.params.stock;
    const like = req.query.like || req.params.like;

    if (typeof stock === "string") {
      const stockData = await getStock(stock);

      if (stockData === "Invalid symbol") {
        return res.json({
          stockData: {
            error: "Invalid symbol",
          },
        });
      } else {
        const stockSymbol = String(stockData["symbol"]);
        const stockPrice = parseFloat(stockData["latestPrice"]);

        if (String(like) === "true") {
          const ipAddress = req.ip;

          const found = await IpLike.findOne(
            { ip: ipAddress, stock: stockSymbol },
            { __v: 0 }
          );

          if (!found) {
            const newIp = IpLike({
              ip: ipAddress,
              stock: stockSymbol,
            });
            await newIp.save();
          }
        }

        const stockLikes = await IpLike.countDocuments({
          stock: stockSymbol,
        });

        return res.json({
          stockData: {
            stock: stockSymbol,
            price: stockPrice,
            likes: stockLikes,
          },
        });
      }
    } else if (stock.length === 2) {
      const stockData1 = await getStock(stock[0]);
      const stockData2 = await getStock(stock[1]);

      let data1 = {};
      let data2 = {};

      if (stockData1 === "Invalid symbol" && stockData2 === "Invalid symbol") {
        return res.json({
          stockData: [{ error: "Invalid symbol" }, { error: "Invalid symbol" }],
        });
      } else if (stockData1 === "Invalid symbol") {
        data1 = {
          error: "Invalid symbol",
        };
      } else if (stockData2 === "Invalid symbol") {
        data2 = {
          error: "Invalid symbol",
        };
      }

      const stockSymbol1 = String(stockData1["symbol"]);
      const stockPrice1 = parseFloat(stockData1["latestPrice"]);

      const stockSymbol2 = String(stockData2["symbol"]);
      const stockPrice2 = parseFloat(stockData2["latestPrice"]);

      if (String(like) === "true") {
        const ipAddress = req.ip;

        const found1 = await IpLike.findOne(
          { ip: ipAddress, stock: stockSymbol1 },
          { __v: 0 }
        );
        const found2 = await IpLike.findOne(
          { ip: ipAddress, stock: stockSymbol2 },
          { __v: 0 }
        );

        if (!found1) {
          const newIp1 = IpLike({
            ip: ipAddress,
            stock: stockSymbol1,
          });
          await newIp1.save();
        }
        if (!found2) {
          const newIp2 = IpLike({
            ip: ipAddress,
            stock: stockSymbol2,
          });
          await newIp2.save();
        }
      }

      const stockLikes1 = await IpLike.countDocuments({
        stock: stockSymbol1,
      });
      const stockLikes2 = await IpLike.countDocuments({
        stock: stockSymbol2,
      });

      if (Object.keys(data1).length === 0) {
        data1 = {
          stock: stockSymbol1,
          price: stockPrice1,
          rel_likes: stockLikes1 - stockLikes2,
        };
      }
      if (Object.keys(data2).length === 0) {
        data2 = {
          stock: stockSymbol2,
          price: stockPrice2,
          rel_likes: stockLikes2 - stockLikes1,
        };
      }

      return res.json({
        stockData: [data1, data2],
      });
    } else {
      res.type("text").send("Please input 1 or 2 stocks only");
    }
  });
};
