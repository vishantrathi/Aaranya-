import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Database, RefreshCw } from 'lucide-react';

import api from '../../api/axios';
import { defaultSiteContent, SiteContent } from '../../lib/siteContent';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(defaultSiteContent, null, 2));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/site-content/admin');
        if (!isMounted) return;

        setJsonText(JSON.stringify(data, null, 2));
        setError('');
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.response?.data?.message || 'Failed to load site content.');
        setJsonText(JSON.stringify(defaultSiteContent, null, 2));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleReset = () => {
    setJsonText(JSON.stringify(defaultSiteContent, null, 2));
    setError('');
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsed = JSON.parse(jsonText) as SiteContent;
      setSaving(true);
      setError('');
      await api.put('/site-content/admin', parsed);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError('JSON is invalid. Fix the syntax before saving.');
      } else {
        setError(err?.response?.data?.message || 'Failed to save site content.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage the full site content document stored in MongoDB.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100">
                <Database className="h-4 w-4 text-primary-700" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Site Content JSON</h2>
                <p className="text-sm text-gray-500">This single document controls the homepage hero, categories, testimonials, footer, and more.</p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">Loading site content...</div>
            ) : (
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={28}
                spellCheck={false}
                className="w-full rounded-2xl border border-gray-200 bg-slate-950 px-4 py-4 font-mono text-sm text-slate-100 outline-none focus:border-primary-400"
              />
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span>Use valid JSON only. Arrays, images, categories, and testimonials all live here.</span>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-50">
                <RefreshCw className="h-3.5 w-3.5" />
                Reset to defaults
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading || saving}
              className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-bold text-white shadow transition-all hover:from-primary-700 hover:to-primary-800 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Site Content'}
            </button>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-emerald-600 text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" /> Saved successfully!
              </motion.div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
