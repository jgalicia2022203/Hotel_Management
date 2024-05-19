import { request, response } from "express";
import Invoice from "./invoice.model.js";

// List all invoices with pagination
export const listInvoices = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, invoices] = await Promise.all([
      Invoice.countDocuments(),
      Invoice.find()
        .skip(Number(from))
        .limit(Number(limit))
        .populate("guest hotel room services.service"),
    ]);
    res.status(200).json({ total, invoices });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during invoices list." });
  }
};

// Create a new invoice
export const createInvoice = async (req, res) => {
  try {
    const { guest, hotel, room, total } = req.body;
    const invoice_number = `INV-${Date.now()}`;
    const invoice = new Invoice({
      guest,
      hotel,
      room,
      total,
      invoice_number,
    });
    await invoice.save();
    res.status(201).json({ msg: "Invoice created successfully", invoice });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during invoice creation." });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  const id = req.params.id;
  try {
    const invoice = await Invoice.findById(id).populate(
      "guest hotel room services.service"
    );
    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found." });
    }
    res.status(200).json({ invoice });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching invoice." });
  }
};

// Delete an invoice
export const cancelInvoice = async (req, res) => {
  const invoiceId = req.params.id;
  try {
    const cancelledInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status: "cancelled" },
      { new: true }
    );
    res.json({
      msg: "Invoice cancelled successfully.",
      user: { id: cancelledInvoice._id, status: cancelledInvoice.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error canceling the invoice." });
  }
};
