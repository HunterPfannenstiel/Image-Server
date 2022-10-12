const port = 443;
import sharp from "sharp";
import fetch from "node-fetch";
import http from "http";

const fetchFor = async (suffix) => {
  const response = await fetch(
    `https://gateway.pinata.cloud/ipfs/QmYs9GBzPP4w3h59pGdtFktqyHcCqUrQ4g7CsCzW7nae7P/${suffix}`,
    { method: "GET" }
  );

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};

async function handler(req, res) {
  if (req.method === "GET") {
    let data;
    try {
      data = await Promise.all([
        fetchFor("Blue%2310.png"),
        fetchFor("Tan%2350.png"),
        fetchFor("Party%20Hat%2320.png"),
      ]);
    } catch (e) {
      console.log(e);
      return;
    }

    const layers = data.map((file) => ({ input: file }));

    let image;
    try {
      image = await sharp(layers[0].input).composite(layers).avif().toBuffer();
    } catch (e) {
      console.log(e);
      res.end();
      return;
    }

    res.writeHead(200, { "Content-Type": "image/avif" }); //Will mark the type of content
    res.end(image); //Will display the image
    return;
  }
}

const server = http.createServer(handler);

server.listen(port, function (error) {
  if (error) {
    console.log("Something went wrong", error);
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});
