import Offer from "../models/Offer.js";

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getPublicOffers = async (req, res) => {
  const { placement } = req.query;
  const now = new Date();

  const filter = {
    isActive: true,
    ...(placement ? { placement } : {}),
    $and: [
      { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
      { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
    ],
  };

  const offers = await Offer.find(filter).sort({ priority: -1, createdAt: -1 });
  res.json(offers);
};

export const getAdminOffers = async (_req, res) => {
  const offers = await Offer.find().sort({ createdAt: -1 });
  res.json(offers);
};

export const createOffer = async (req, res) => {
  const payload = {
    ...req.body,
    startAt: parseDate(req.body.startAt),
    endAt: parseDate(req.body.endAt),
  };

  if (!payload.title || !payload.offerText || !payload.image) {
    res.status(400);
    throw new Error("title, offerText and image are required");
  }

  if (!["home", "blog"].includes(payload.placement)) {
    payload.placement = "home";
  }

  const offer = await Offer.create(payload);
  res.status(201).json(offer);
};

export const updateOffer = async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }

  const payload = {
    ...req.body,
    ...(req.body.startAt !== undefined ? { startAt: parseDate(req.body.startAt) } : {}),
    ...(req.body.endAt !== undefined ? { endAt: parseDate(req.body.endAt) } : {}),
  };

  Object.assign(offer, payload);
  const updated = await offer.save();
  res.json(updated);
};

export const deleteOffer = async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }

  await offer.deleteOne();
  res.json({ message: "Offer deleted" });
};
