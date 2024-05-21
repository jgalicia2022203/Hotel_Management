import { request, response } from "express";
import fs from "fs";
import pdf from "html-pdf";
import path from "path";
import { fileURLToPath } from "url";
import Invoice from "./invoice.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    res.status(500).json({
      msg: "An unexpected error occurred during invoice creation.",
      error: e.message,
    });
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
    res.status(500).json({
      msg: "An unexpected error occurred during fetching invoice.",
      error: error.message,
    });
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
    res
      .status(500)
      .json({ msg: "Error canceling the invoice.", error: error.message });
  }
};

// Download invoice
export const downloadInvoice = async (req, res) => {
  const { invoiceId } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId).populate(
      "guest hotel room services.service"
    );

    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    const templatePath = path.join(
      __dirname,
      "../templates/invoice-template.html"
    );
    const template = fs.readFileSync(templatePath, "utf8");

    // Generate HTML content based on the invoice data
    const content = template
      .replace("{{invoiceNumber}}", invoice.invoice_number)
      .replace("{{guestName}}", invoice.guest.name)
      .replace("{{hotelName}}", invoice.hotel.name)
      .replace("{{roomNumber}}", invoice.room.room_number)
      .replace("{{total}}", invoice.total)
      .replace("{{issuedDate}}", invoice.issuedDate.toDateString())
      .replace(
        "{{services}}",
        invoice.services
          .map((service) => `<li>${service.name}: $${service.price}</li>`)
          .join("")
      );

    pdf.create(content).toStream((err, stream) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ msg: "Error generating PDF", error: err.message });
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Invoice-${invoice.invoice_number}.pdf`
      );
      stream.pipe(res);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error generating invoice", error: error.message });
  }
};
