import Invoice from "./invoice.model.js";

export const listInvoices = async (req, res) => {
  try {
    const { limit, from } = req.query;
    const invoices = await Invoice.find()
      .populate("guest", "name")
      .populate("hotel", "name")
      .populate("room", "room_number")
      .skip(Number(from))
      .limit(Number(limit));
    res.status(200).json(invoices);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while listing invoices",
      error: e.message,
    });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { guest, hotel, room, services, total } = req.body;
    const newInvoice = new Invoice({ guest, hotel, room, services, total });
    await newInvoice.save();
    res.status(201).json({
      msg: "Invoice created successfully",
      newInvoice,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during Invoice creation",
      error: e.message,
    });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json({
      msg: "Invoice deactivated successfully.",
      service: { id: updatedInvoice._id, status: updatedInvoice.status },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error deactivating the invoice." });
  }
};
