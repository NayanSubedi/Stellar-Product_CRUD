
const sorobanService = require("../services/sorobanService");

exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const result = await sorobanService.invokeFunction("create_product", [
      { type: "string", value: name },
      { type: "string", value: description },
      { type: "int", value: price },
    ]);
    res.status(200).json({ message: "Product created successfully!", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await sorobanService.invokeFunction("get_product_by_id", [
      { type: "int", value: productId },
    ]);
    res.status(200).json({ product: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { newName, newDescription, newPrice } = req.body;
  try {
    const result = await sorobanService.invokeFunction("update_product", [
      { type: "int", value: productId },
      { type: "string", value: newName },
      { type: "string", value: newDescription },
      { type: "int", value: newPrice },
    ]);
    res.status(200).json({ message: "Product updated successfully!", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await sorobanService.invokeFunction("delete_product", [
      { type: "int", value: productId },
    ]);
    res.status(200).json({ message: "Product deleted successfully!", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
