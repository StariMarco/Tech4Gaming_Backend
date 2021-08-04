const amazon = require("amazon-product-api");

var client = amazon.createClient({
  awsId: "Id",
  awsSecret: "Secret",
  awsTag: "Tag",
});

client
  .itemLookup({
    idType: "UPC",
    itemId: "884392579524",
  })
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    console.log(err);
  });
