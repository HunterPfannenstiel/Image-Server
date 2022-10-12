import sharp from "sharp";

export default module.exports = async (req, res) => {
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
      res.status(500).json({ message: "Erorr" });
      return;
    }

    res.writeHead(200, { "Content-Type": "image/avif" }); //Will mark the type of content
    res.end(image); //Will display the image
    return;
  }
};

const fetchFor = async (suffix) => {
  const response = await fetch(
    `https://gateway.pinata.cloud/ipfs/QmYs9GBzPP4w3h59pGdtFktqyHcCqUrQ4g7CsCzW7nae7P/${suffix}`,
    { method: "GET" }
  );

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
};
