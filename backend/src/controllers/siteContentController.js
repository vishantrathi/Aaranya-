import SiteContent from "../models/SiteContent.js";
import siteContentDefaults from "../lib/siteContentDefaults.js";

const CONTENT_KEY = siteContentDefaults.key;

const normalizeContent = (payload, currentData = siteContentDefaults) => {
  if (!payload || typeof payload !== "object") {
    return currentData;
  }

  return {
    ...currentData,
    ...payload,
    hero: {
      ...currentData.hero,
      ...(payload.hero || {}),
      trustPoints: Array.isArray(payload.hero?.trustPoints)
        ? payload.hero.trustPoints
        : currentData.hero.trustPoints,
    },
    categories: Array.isArray(payload.categories) ? payload.categories : currentData.categories,
    whyChoose: Array.isArray(payload.whyChoose) ? payload.whyChoose : currentData.whyChoose,
    story: {
      ...currentData.story,
      ...(payload.story || {}),
      highlights: Array.isArray(payload.story?.highlights)
        ? payload.story.highlights
        : currentData.story.highlights,
    },
    testimonials: Array.isArray(payload.testimonials) ? payload.testimonials : currentData.testimonials,
    seasonal: {
      ...currentData.seasonal,
      ...(payload.seasonal || {}),
    },
    footer: {
      ...currentData.footer,
      ...(payload.footer || {}),
      quickLinks: Array.isArray(payload.footer?.quickLinks)
        ? payload.footer.quickLinks
        : currentData.footer.quickLinks,
      categories: Array.isArray(payload.footer?.categories)
        ? payload.footer.categories
        : currentData.footer.categories,
      policies: Array.isArray(payload.footer?.policies)
        ? payload.footer.policies
        : currentData.footer.policies,
      contact: {
        ...currentData.footer.contact,
        ...(payload.footer?.contact || {}),
      },
    },
  };
};

const getOrCreateSiteContent = async () => {
  let siteContent = await SiteContent.findOne({ key: CONTENT_KEY });

  if (!siteContent) {
    siteContent = await SiteContent.create({ key: CONTENT_KEY, data: siteContentDefaults });
  }

  return siteContent;
};

export const getSiteContent = async (_req, res) => {
  const siteContent = await getOrCreateSiteContent();
  res.json(siteContent.data);
};

export const updateSiteContent = async (req, res) => {
  const siteContent = await getOrCreateSiteContent();
  const payload = req.body?.data ?? req.body;

  siteContent.data = normalizeContent(payload, siteContent.data);
  const updated = await siteContent.save();

  res.json(updated.data);
};